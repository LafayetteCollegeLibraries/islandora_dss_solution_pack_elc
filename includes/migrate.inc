<?php

  /**
   * @file Migration functionality for the Easton Library Company Project
   * @author griffinj@lafayette.edu
   *
   */

define('ITEM_VOLUMES_TAXON', 'item_volumes');

/**
 * Migrating books from the MySQL database used for the legacy app.
 * Extended to integrate the field "publication date" using an exported CSV (EDDC-511)
 *
 * @param PDO $db
 *   The PDO connection to the MySQL database
 * @param string  $csv_file_path
 *   An optional file path to the CSV-formatted file containing extraneous information
 * @param string  $normalize_file_path
 *   An optional file path to the CSV-formatted file containing normalization information
 * @param int $limit (Deprecated)
 *   An optional limit for the number of records to be migrated
 * @param int $bookId (Deprecated)
 *   An optional identified for a specific "book" record to be migrated
 *
 */
function dss_elc_migrate_books($db, $csv_file_path = NULL, $normalize_file_path = NULL, $limit = 0, $bookId = NULL) {

  // Insert the limit clause
  if($limit > 0) {

    $sql = "SELECT * FROM :table_name LIMIT $limit";
  } else {

    $sql = 'SELECT * FROM :table_name';
  }

  // Load the publication year data
  $csv_file_data = array();
  if(!is_null( $csv_file_path )) {

    // Search and retrieve the entry for the item record
    if(($csv_handle = fopen($csv_file_path, "r")) !== FALSE) {

      while(($csv_data = fgetcsv($csv_handle, 1000, ",")) !== FALSE) {

	$csv_file_data[] = $csv_data;
      }
      
      fclose($csv_handle);
    }
  }

  // Load the normalization data
  $normalize_data = array();
  if(!is_null( $normalize_file_path )) {

    // Search and retrieve the entry for the item record
    if(($csv_handle = fopen($normalize_file_path, "r")) !== FALSE) {

      while(($csv_data = fgetcsv($csv_handle, 1000, ",")) !== FALSE) {

	$normalize_data[$csv_data[0]] = array($csv_file_data[$csv_data[1] - 1]);
      }

      fclose($csv_handle);
    }
  }

  // Retrieve all book records and serialize them as Book or Periodical Nodes
  foreach(drush_dss_elc_get_records($db, 'books', $limit, $bookId) as $book) {

    $frbr_entities = array();
    $book_title = mb_convert_encoding($book['title'], "UTF-8", 'ASCII');

    // Instantiate a new manifestion for each book or periodical
    drush_log(dt("Migrating the manifestation !book_title", array('!book_title' => $book_title)), 'ok');

    $manifestation_entity = entity_create('node', array('type' => 'manifestation',
							'uid' => 1,
							'status' => $book['flagStatus'] == '1' ? 0 : 1, // Publish or unpublish the node based upon whether or not it was "flagged" in the legacy system
							'comment' => 1,
							'promote' => 0,
							));

    $manifestation_md = entity_metadata_wrapper('node', $manifestation_entity);

    // Set the title of the manifestation
    /**
     * Field length cannot be set by the administrative user
     * Please see the issue https://drupal.org/node/1921302
     *
     */
    $manifestation_md->field_artifact_title->set($book_title);    
    if(strlen($book_title) > 255) {
      
      $manifestation_md->title->set(substr($book_title, 0, 255));
    } else {
      
      $manifestation_md->title->set($book_title);
    }

    $manifestation_md->field_manifest_total_vol->set(intval($book['totalVolumes']));

    // Retrieve the author Entity

    //$author_entity = dss_elc_get_person();
    //$manifestation_md->field_artifact_was_authored_by->set(intval($author_entity->nid));
    // Set the author for the item
    $author_name = mb_convert_encoding($book['author'], 'UTF-8', 'ASCII');

    $author_nids = array();

    // Note that the author name may be delimited by a semi-colon
    foreach(preg_split('/;/', $author_name) as $delim_author_name) {

      $author_entity = dss_elc_get_human($delim_author_name, 'Author');
      $author_nids[] = intval($author_entity->nid);
    }
    $manifestation_md->field_artifact_was_authored_by->set($author_nids);

    // Serialize the manifestation Node
    $manifestation_md->save(true);
    entity_save('node', $manifestation_entity);

    $frbr_entities[] = $manifestation_entity;

    // Iterate over all "Items" related to the "Manifestation"
    $book_volumes = array();
    if(is_null($book['totalVolumes'])) {
      
      $book_volumes = array(0);
    } else {

      $book_volumes = range(1, (int) $book['totalVolumes']);
    }

    // Instantiate a new book or periodical node for each book volume
    foreach($book_volumes as $book_volume) {

      drush_log(dt("Migrating volume $book_volume of the item $book_title"), 'ok');

      // Deprecated due to focus being paid to Item Nodes
      $values = array('type' => 'item',
		      'uid' => 1,
		      'status' => $book['flagStatus'] == '1' ? 0 : 1,
		      'comment' => 1,
		      'promote' => 0,
		      );
      
      // Entity is...
      $book_entity = entity_create('node', $values);
      $book_md = entity_metadata_wrapper('node', $book_entity);

      $book_md->field_book_or_periodical->set(intval($book['type']));

      /**
       * Field length cannot be set by the administrative user
       * Please see the issue https://drupal.org/node/1921302
       */

      // Titles must have HTML character entities removed
      $book_title = html_entity_decode($book_title);

      $book_node_title = dss_elc_normalize_book_title($book, $book_title, $book_volume, $author_name);

      drush_log(dt("Normalizing the title into $book_node_title"), 'ok');

      $book_md->title->set($book_node_title);
      $book_md->field_artifact_title->set($book_node_title);

      $book_md->field_artifact_was_authored_by = $author_nids;

      if($book_volume > 0) {

	$volumeTerm = dss_elc_get_taxonomy_term( (string) $book_volume, ITEM_VOLUMES_TAXON);
	$book_md->field_item_volume_migrate->set(intval($volumeTerm->tid));
      }

      if(isset($book['subject'])) {

	foreach(preg_split('/;/', $book['subject']) as $subject) {

	  $book_md->field_item_subject[] = dss_elc_get_taxonomy_term($subject, 'item_subjects')->tid;
	}
      }
      
      // Set the format for the book or periodical
      // Handle anomalous values identified within the data set
      switch($book['format']) {
      
      case '': // Handle for cases in which the format is set to a NULL value

	$book_md->field_item_format->set(NULL);
	break;
      case 'Octavo':
	
	$book_md->field_item_format->set(0);
	break;
      case 'Quarto':

	$book_md->field_item_format->set(1);
	break;
      case 'Duodecimo':
	
	$book_md->field_item_format->set(2);
	break;

      default:
	
	$book_md->field_item_format->set(intval($book['format']));
      }

      //$book_md->field_item_number->set($book['number'] == 'NULL' ? 0 : intval($book['number']));

      // Book/Periodical numbers are managed as taxonomy terms
      $book_number_term = dss_elc_get_taxonomy_term($book['number'], 'item_numbers');
      $book_md->field_item_number_taxon->set($book_number_term->tid);

      $book_md->body->set(array('value' => $book['flagMessage']));

      // Relate the book or periodical to the manifestation entity being instantiated
      $book_md->field_item_embodies->set(intval($manifestation_entity->nid));

      // Only search the CSV data if it's been populated from the file
      if(!empty($csv_file_data)) {

	$matches = array();

	// For normalize title values, map the records using additional normalization data
	if( array_key_exists($book['id'], $normalize_data) ) {
	  
	  $matches = $normalize_data[$book['id']];
	} else {

	  foreach($csv_file_data as $e) {

	    $csv_title = trim($e[2]);
	    $decoded_csv_title = utf8_encode($csv_title);
	    
	    if((mb_stristr( $book_title, $csv_title ) or
		mb_stristr( $csv_title, $book_title )) and $e[0] == $book['format'] and $e[1] == $book['number']) {

	      $matches[] = $e;
	    }
	  }
	}

	if(empty($matches)) {

	  drush_log(dt("Failed to find the publication date for !book_title (!book_format) (!book_number)", array('!book_title' => $book_title,
														  '!book_format' => $book['format'],
														  '!book_number' => $book['number']) ), 'warning');
	} elseif( count($matches) > 1 ) {

	  //print "Duplicates found for " . $data[0] . "\n";
	  drush_log(dt("Duplicate entries found for !book_title (!book_format) (!book_number)", array('!book_title' => $book_title,
												      '!book_format' => $book['format'],
												      '!book_number' => $book['number']) ), 'error');
	} else {

	  $e = array_shift($matches);

	  if(preg_match('/\d{4}/', $e[8], $year_match)) {
	    
	    //$publication_year = trim($publication_year);
	    $publication_year = $year_match[1];

	    $publication_date = new DateTime("$publication_year-01-01 00:00:00", new DateTimeZone('America/New_York')); // Easton

	    // Add the initial publication date from the CSV-formatted file
	    $book_md->field_initial_publication_date->set($publication_date->getTimestamp());
	  } elseif(!empty($e[8])) {

	    drush_log(dt("Failed to parse publication date for !year", array('!year' => $e[8])), 'error');
	  }
	}
      }

      try {

	// Serialize the book Node
	$book_md->save(true);
	entity_save('node', $book_entity);
      } catch(Exception $e) {

	drush_log(dt("Failed to migrate $book_title: {$e->getMessage()}"), 'error');
      }
    }

    // Relate an author to the manifestation, as well as to the items within a single relationship
    //dss_elc_migrate_author($book['author'], $frbr_entities);
  }
}
