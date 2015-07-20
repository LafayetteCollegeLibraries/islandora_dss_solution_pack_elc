<?php

function dss_elc_drush_help($command) {

  switch($command) {
    
  case 'islandora-ingest-root':
    return dt('to be implemented');
  case 'islandora-purge-root':
    return dt('to be implemented');
  }
  }

function dss_elc_drush_command() {

  $items = array();

  $items['dss-elc-migrate-humans'] =
    array(
	  'description' => dt('Migrate the ELC "shareholder" and "representative" records into Human Nodes'),
	  'arguments' => array('arg1' => dt('MySQL user name'),
			       'arg2' => dt('MySQL user password'),
			       'arg3' => dt('MySQL LIMIT clause'),
			       'arg4' => dt('MySQL database'),
			       'arg5' => dt('MySQL server')),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-migrate-humans',
			      'Argument example' => 'drush dss-elc-migrate-humans cake secret elc_production localhost 9',
			      ),
	  'aliases' => array('elc-mh'));

  $items['dss-elc-delete-humans'] =
    array(
	  'description' => dt('Delete all Human Nodes'),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-migrate-humans',
			      ),
	  'aliases' => array('elc-dh'));

  $items['dss-elc-migrate-books'] =
    array(
	  'description' => dt('Migrate the ELC "book" records (and related authors) into Book and Periodical Nodes'),
	  'arguments' => array('arg1' => dt('MySQL user name'),
			       'arg2' => dt('MySQL user password'),
			       'arg3' => dt('MySQL LIMIT clause'),
			       'arg4' => dt('MySQL database'),
			       'arg5' => dt('MySQL server')),

	  'examples' => array(
			      'Standard example' => 'drush dss-elc-migrate-books',
			      'Argument example' => 'drush dss-elc-migrate-books cake secret elc_production localhost 9',
			      ),
	  'aliases' => array('elc-mb'));

  $items['dss-elc-delete-books'] =
    array(
	  'description' => dt('Delete all Book and Periodical Nodes'),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-delete-books',
			      ),
	  'aliases' => array('elc-db'));

  $items['dss-elc-relate-pers-rel-objects'] =
    array(
	  'description' => dt(''),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-relate-bib-rel-objects',
			      ),
	  'aliases' => array('elc-rpro'));

  $items['dss-elc-relate-bib-rel-objects'] =
    array(
	  'description' => dt(''),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-relate-bib-rel-objects',
			      ),
	  'aliases' => array('elc-rbro'));

  $items['dss-elc-relate-subjects'] =
    array(
	  'description' => dt(''),
	  'examples' => array(
			      'Standard example' => '',
			      ),
	  'aliases' => array('elc-rsub'));

  $items['dss-elc-normalize-books-utf8'] =
    array(
	  'description' => dt('Normalize all Book and Periodical Node Titles'),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-normalize-books',
			      ),
	  'aliases' => array('elc-nb'));

  $items['dss-elc-normalize-books'] =
    array(
	  'description' => dt('Normalize all Book and Periodical Node Titles'),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-normalize-books',
			      ),
	  'aliases' => array('elc-nb'));

  $items['dss-elc-migrate-loans'] =
    array(
	  'description' => dt('Migrate the ELC "loan" records into Loan Nodes'),
	  'arguments' => array('arg1' => dt('MySQL user name'),
			       'arg2' => dt('MySQL user password'),
			       'arg3' => dt('MySQL database'),
			       'arg4' => dt('MySQL server'),
			       'arg5' => dt('MySQL LIMIT clause')),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-migrate-loans',
			      'Argument example' => 'drush dss-elc-migrate-loans cake secret elc_production localhost 9',
			      ),
	  'aliases' => array('elc-ml'));

  $items['dss-elc-random-loans'] =
    array(
	  'description' => dt('Publish and tag a randomized subset ELC "loan" records'),
	  'arguments' => array(),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-random-loans',
			      ),
	  'aliases' => array('elc-rand'));

  $items['dss-elc-publish-humans'] =
    array(
	  'description' => dt('Publish all ELC "human" records'),
	  'arguments' => array(),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-publish-humans',
			      ),
	  'aliases' => array('elc-ph'));

  $items['dss-elc-publish-items'] =
    array(
	  'description' => dt('Publish all ELC "item" records'),
	  'arguments' => array(),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-publish-items',
			      ),
	  'aliases' => array('elc-pi'));

  $items['dss-elc-publish-loans'] =
    array(
	  'description' => dt('Publish all ELC "loan" records'),
	  'arguments' => array(),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-publish-loans',
			      ),
	  'aliases' => array('elc-pl'));

  $items['dss-elc-clean-terms'] =
    array(
	  'description' => dt('Clean all ELC "terms"'),
	  'arguments' => array(),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-clean-terms',
			      ),
	  'aliases' => array());

  $items['dss-elc-clean-loans'] =
    array(
	  'description' => dt('Clean all ELC "loan" records'),
	  'arguments' => array(),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-clean-loans',
			      ),
	  'aliases' => array());

  $items['dss-elc-delete-loans'] =
    array(
	  'description' => dt('Delete all Loan Nodes'),
	  'examples' => array(
			      'Standard example' => 'drush dss-elc-delete-loans',
			      ),
	  'aliases' => array('elc-dl'));

  $items['dss-elc-metrics-network'] =
    array(
	  'description' => dt('Generate network metrics'),
	  'examples' => array(
			      'Standard example' => 'drush elc-metrics-network',
			      ),
	  'aliases' => array('elc-nm'));

  $items['dss-elc-metrics-cache-loans'] =
    array(
	  'description' => dt('Cache loans for quantitative analysis'),
	  'examples' => array(
			      'Standard example' => 'drush elc-metrics-cache-loans',
			      ),
	  'aliases' => array('elc-cl'));

  $items['dss-elc-collection-generate-paths'] =
    array(
	  'description' => dt(''),
	  'examples' => array(
			      'Standard example' => 'drush elc-collection-generate-paths',
			      ),
	  'aliases' => array(''));

  $items['dss-elc-manifestation-migrate-title'] =
    array(
	  'description' => dt(''),
	  'examples' => array(
			      'Standard example' => '',
			      ),
	  'aliases' => array(''));

  return $items;
}

function drush_dss_elc_manifestation_migrate_title() {

  $query = new EntityFieldQuery();
  
  $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'manifestation');
  //->range(0,1);

  $result = $query->execute();

  if(!empty($result['node'])) {

    $nids = array_keys($result['node']);

    $nodes = array_map(function($nid) {

	return node_load($nid);
      }, $nids);

    foreach($nodes as $node) {

      $node_md = entity_metadata_wrapper('node', $node);

      /*
      $query->entityCondition('entity_type', 'node')
	->entityCondition('bundle', array('item', 'book', 'periodical'), 'IN')
	->fieldCondition('field_item_embodies', 'target_id', $node->nid)
	->range(0,1);

      $result = $query->execute();
      */

      list($query, $results) = dss_elc_metrics_solr_query(array('item', 'book', 'periodical'), array('entity_id:' . $node->nid), 1);

      $docs = $results->response->docs;

      //if(!empty($result['node'])) {
      if( !empty($docs) ) {

	/*
	$items = array_map(function($nid) {
	    
	    return node_load($nid);
	  }, array_keys($result['node']) );

	$item = array_shift($items);
	*/

	$item_doc = $docs[0];

	$item = (object) array('title' => $item_doc->label);

	print_r($item);
      
	drush_log('Updating ' . $node->nid . ' (' . $node->title . ') with ' . $item->title . '...', 'ok');

	$node_md->field_artifact_title->set($item->title);

	drush_log('Saving ' . $node->nid . ' (' . $node_md->field_artifact_title->value() . ')' . '...', 'ok');

	$node_md->save(true);
	entity_save('node', $node);

	drush_log('Successfully updated ' . $node->nid . ' (' . $node->title . ')', 'success');
      }
    }
  }
}

function drush_dss_elc_collection_generate_paths($pid, $url = 'localhost') {

  // Get the connection
  $connection = islandora_get_tuque_connection(user_load(1), $url);
  
  module_load_include('inc', 'islandora', 'includes/utilities');

  //! @todo Refactor using the Object-Oriented API

  $f = function($options) {

    $pid = $options['pid'];
    $connection = $options['connection'];
		   

    $query = 'SELECT $object $title $content
     FROM <#ri>
     WHERE {
            $object $collection_predicate <info:fedora/' . $pid . '> ;
                   <fedora-model:label> $title ;
                   <fedora-model:hasModel> $content ;
                   <fedora-model:state> <fedora-model:Active> .
            FILTER(sameTerm($collection_predicate, <fedora-rels-ext:isMemberOfCollection>) || sameTerm($collection_predicate, <fedora-rels-ext:isMemberOf>))
            FILTER (!sameTerm($content, <info:fedora/fedora-system:FedoraObject-3.0>))';
    
    /*
    $enforced = variable_get('islandora_namespace_restriction_enforced', FALSE);
    if ($enforced) {
      $namespace_array = explode(' ', variable_get('islandora_pids_allowed', 'default: demo: changeme: ilives: islandora-book: books: newspapers: '));
      $namespace_array = array_map('islandora_get_namespace', $namespace_array);
      $namespace_array = array_filter($namespace_array, 'trim');
      $namespace_sparql = implode('|', $namespace_array);
      $query .= 'FILTER(regex(str(?object), "info:fedora/(' . $namespace_sparql . '):"))';
    }
    */
    $query .= '} ORDER BY $title';
    $query_array = array(
			 'query' => $query,
			 'type' => 'sparql',
			 //'pid' => $obj_pid,
			 // Seems as though this is ignored completely.
			 'page_size' => $page_size,
			 'page_number' => $page_number,
			 );

    return array_map(function($result) {

	return islandora_object_load($result['object']['value']);
      }, $connection->repository->ri->query($query_array['query'], $query_array['type']));
  };

  //foreach($connection->repository->ri->query($query_array['query'], $query_array['type']) as $result) {

  $options = array('pid' => $pid,
		   'connection' => $connection);

  foreach($f($options) as $coll) {

    //$object = islandora_object_load($result['object']['value']);

    $options = array('pid' => $coll->id,
		     'connection' => $connection);

    foreach($f($options) as $object) {

      // Construct the path from the label
      preg_match('/(.+?)\.tif$/', $object->label, $m);
	
      $alias = 'collections/eastonlibrary/' . $m[1];
      $source = 'islandora/object/' . $object->id;

      drush_log('Attempting to generate the alias ' . $alias . ' for the path ' . $source . '...', 'ok');

      $path = array('source' => $source,
		    'alias' => $alias);

      path_delete( array('source' => $source));
      path_save($path);

      drush_log('Successfully generated the alias ' . $alias . ' for the path ' . $source, 'success');
    }

    drush_log($coll->label, 'ok');

    preg_match('/Ledger (\d)/', $coll->label, $m);

    $alias = 'collections/eastonlibrary/ELCv' . $m[1];
    $source = 'islandora/object/' . $coll->id;

    drush_log('Attempting to generate the alias ' . $alias . ' for the path ' . $source . '...', 'ok');

    $path = array('source' => $source,
		  'alias' => $alias);

    path_delete( array('source' => $source));
    path_save($path);
    
    drush_log('Successfully generated the alias ' . $alias . ' for the path ' . $source, 'success');
  }

  $alias = 'collections/eastonlibrary';
  $source = 'islandora/object/' . $pid;

  drush_log('Attempting to generate the alias ' . $alias . ' for the path ' . $source . '...', 'ok');

  $path = array('source' => $source,
		'alias' => $alias);

  path_delete( array('source' => $source));
  path_save($path);
    
  drush_log('Successfully generated the alias ' . $alias . ' for the path ' . $source, 'success');
}

/*
function dss_elc_get_taxonomy_term($term_value, $vocab_name) {

  // Check for the taxonomical term containing the term
  $terms = taxonomy_get_term_by_name($term_value, $vocab_name);
  
  // If the term has not been linked to this vocabulary yet, instantiate the term
  if(!empty($terms)) {

    return array_pop($terms);
  } else {

    $vocab = taxonomy_vocabulary_machine_name_load($vocab_name);
    
    $term = new stdClass();
    $term->name = $term_value;
    $term->vid = $vocab->vid;

    taxonomy_term_save($term);
    return $term;
  }
}
*/

/**
 * Retrieves the records from the "books" table within the legacy application
 *
 */
function drush_dss_elc_get_records($db, $table_name, $limit = 0, $bookId = NULL) {

  // Select the book record by its primary key "id"
  if(isset($bookId)) {
    
    $sql = "SELECT * FROM $table_name WHERE id=$bookId";
  // Insert the limit clause
  } elseif($limit > 0) {

    $sql = "SELECT * FROM $table_name LIMIT $limit";
  } else {

    $sql = "SELECT * FROM $table_name";
  }

  return $db->query($sql);
}

/**
 *
 * @author griffinj@lafayette.edu
 * Node labels can only be structured using a string of a fixed length
 *
 */
function dss_elc_normalize_book_title($book, $book_title, $book_volume, $book_author) {

  /**
   * Ensure that the title is properly formatted in order to render the format, catalogue numbers, and identifier
   *
   */
  if($book_volume == 0) {

    $title_suffix = ' (' . $book['format'] . ' ' . $book['number'] . ')';
  } else {

    $title_suffix = ' [Vol. ' . (string) $book_volume . '] (' . $book['format'] . ' ' . $book['number'] . ')';
  }

  // Normalize in response to EDDC-514
  if( preg_match('/^Works(.+)/', $book_title, $book_title_match) ) {

    $book_author_names = explode($book_author, ',');
    $book_author_surname = array_pop($book_author_names);

    $book_title = $book_author_surname . "'" . substr($book_author_surname, -1) === 's' ? '' : 's' . " Works" . $book_title_match[1];
  }

  if(strlen($book_title) > (254 - strlen($title_suffix))) {

    $book_node_title = substr($book_title, 0, 128) . '...' . $title_suffix;
  } else {

    $book_node_title = $book_title . $title_suffix;
  }  

  return $book_node_title;
}



/**
 * Hook implementation for the Drush "Book" migration task
 *
 * @param string $mysql_user
 *   The user name for the legacy MySQL database server
 * @param string $mysql_pass
 *   The password for the legacy MySQL database server
 * @param string $mysql_database
 *   The name of the legacy MySQL database
 * @param string $mysql_server
 *   The host for the legacy MySQL database server
 * @param string $csv_file_path
 *   An optional file path to the CSV-formatted file containing extraneous information
 * @param string  $normalize_file_path
 *   An optional file path to the CSV-formatted file containing normalization information
 * @param int $limit (Deprecated)
 *   The limit for the number of records migrated
 * @param string $bookId (Deprecated)
 *   The ID for a "book" record to be migrated
 *
 */
function drush_dss_elc_migrate_books($mysql_user,
				     $mysql_database='elc',
				     $mysql_server='localhost',

				     $csv_file_path = NULL,
				     $normalize_file_path = NULL,

				     $limit=0,
				     $bookId=NULL) {

  $mysql_pass = drush_prompt(dt('Password'), NULL, TRUE, TRUE);

  module_load_include('inc', 'dss_elc', 'includes/migrate');

  $db = new PDO("mysql:host=$mysql_server;dbname=$mysql_database;charset=utf8", $mysql_user, $mysql_pass);
  dss_elc_migrate_books($db, $csv_file_path, $normalize_file_path);

  drush_dss_elc_relate_subjects($mysql_user,
				$mysql_pass,
				$mysql_database,
				$mysql_server);

  drush_dss_elc_normalize_books_utf8();

  return;
}

function drush_dss_elc_relate_pers_rel_objects() {

  $drupalQuery = new EntityFieldQuery();

  $items = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'personal_relationship')
    //->fieldCondition('field_pers_rel_object', 'target_id', 0)
    ->fieldCondition('field_pers_rel_subject', 'target_id', 0)
    ->execute();

  if(isset($items['node'])) {

    foreach(entity_load('node', array_keys($items['node'])) as $item) {

      /*
      $item_md = entity_metadata_wrapper('node', $item);
      drush_log(dt("Normalizing the title for " . $item->title . '...'), 'ok');
      */

      //print_r($item);

      drush_log(dt("Linking the object for " . $item->title . ' (' . $item->nid . ')...'), 'ok');

      /*
      //node_save($item);
      $item_md->save(true);
      entity_save('node', $item);
      */
    }
  }
}

function drush_dss_elc_relate_subjects($mysql_user,
				       $mysql_pass,
				       $mysql_database='elc',
				       $mysql_server='localhost') {
  
  $db = new PDO("mysql:host=$mysql_server;dbname=$mysql_database;charset=utf8", $mysql_user, $mysql_pass);
  $query = "SELECT title,subject FROM books;";

  //foreach($db->query($query) as $original_item) {
  foreach(drush_dss_elc_get_records($db, 'books', $limit, $bookId) as $original_item) {

    $drupalQuery = new EntityFieldQuery();

    $original_item_title = mb_convert_encoding($original_item['title'], "UTF-8", 'ASCII');

    //! Generate the title from various values

    // Instantiate a new book or periodical node for each book volume
    foreach(range(1, (int) $original_item['totalVolumes']) as $book_volume) {

      $author_name = mb_convert_encoding($original_item['author'], 'UTF-8', 'ASCII');
      $original_item_title = dss_elc_normalize_book_title($original_item, $original_item_title, $book_volume, $author_name);

      $items = $drupalQuery->entityCondition('entity_type', 'node')
	->entityCondition('bundle', array('book', 'periodical', 'item'))
	->propertyCondition('title', $original_item_title)
	->execute();

      if(!is_null($items['node'])) {
      
	foreach(entity_load('node', array_keys($items['node'])) as $item) {
	
	  if($original_item['subject'] and $original_item['subject'] != '') {
	    
	    $item_md = entity_metadata_wrapper('node', $item);
	    $terms = taxonomy_get_term_by_name($original_item['subject'], 'item_subjects');
	  
	    if(!empty($terms)) {
	      
	      $subject_term = array_shift($terms);
	      
	      // Set the type of the item
	      $item_md->field_item_subject->set(array(intval($subject_term->tid)));
	    
	      drush_log(dt('Linking ' . $item->title . ' to the subject heading ' . $subject_term->name), 'ok');
	      $item_md->save(true);
	      entity_save('node', $item);
	      drush_log(dt('Successfully linked ' . $item->title . ' to the subject heading ' . $subject_term->name), 'success');
	    }
	  }
	}
      }
    }
  }
}

function drush_dss_elc_relate_bib_rel_objects($mysql_user,
					      $mysql_pass,
					      $mysql_database='elc_production') {

  $drupalQuery = new EntityFieldQuery();

  $loans = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'loan')
    ->fieldCondition('field_bib_rel_object', 'target_id', 0)
    ->execute();

  if(isset($loans['node'])) {

    foreach(entity_load('node', array_keys($loans['node'])) as $loan) {

      /*
      $loan_md = entity_metadata_wrapper('node', $loan);
      drush_log(dt("Normalizing the title for " . $loan->title . '...'), 'ok');
      */

      //print_r($loan);

      drush_log(dt("Linking the object for " . $loan->title . ' (' . $loan->nid . ')...'), 'ok');

      // Wolf, Charles E. borrowed  on 1818/09/26
      preg_match('/(.+?) borrowed  on (.+)/', $loan->title, $m);
      $representative = $m[1];
      $checkout = $m[2];
      $checkout = preg_replace('/\//', '-', $checkout);

      $pdo = new PDO("mysql:host=$mysql_server;dbname=$mysql_database;charset=utf8", $mysql_user, $mysql_pass);
      $query = "SELECT b.title FROM loans INNER JOIN books as b on b.id=loans.book_id INNER JOIN representatives as r ON r.id=loans.representative_id WHERE loans.checkout='$checkout' and r.name='$representative';";

      $drupalQuery = new EntityFieldQuery();
      foreach($pdo->query($query) as $original_loan) {

	drush_log(dt("Searching for " . $original_loan['title'] . '...'), 'ok');

	$items = $drupalQuery->entityCondition('entity_type', 'node')
	  ->entityCondition('bundle', 'book')
	  ->propertyCondition('title', '%' . substr($original_loan['title'], 0, 20) . '%' . substr($original_loan['title'], 21), 'LIKE')
	  ->execute();

	if(isset($items['node'])) {

	  $item = array_pop(entity_load('node', array_keys($items['node'])));

	  drush_log(dt("Found " . $item->title . '...'), 'ok');

	  $loan_md = entity_metadata_wrapper('node', $loan);
	  $loan_md->field_bib_rel_object[] = intval($item->nid);

	  $loan_md->save(true);
	  entity_save('node', $loan);

	  drush_log(dt("Successfully related " . $item->title . '(' . $item->nid . ') to ' . $loan->nid), 'success');
	} else {

	  drush_log(dt("Could not find " . $original_loan['title'] . ' (using "' . substr($original_loan['title'], 0, 20) . '")'), 'error');
	  exit(1);
	}
      }
    }
  }
}

function drush_dss_elc_normalize_books_utf8() {

  $drupalQuery = new EntityFieldQuery();

  foreach(array('book', 'periodical', 'manifestation', 'item') as $content_type) {

    $items = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', $content_type)
      ->propertyCondition('title', '%' . '' . '%', 'LIKE')
      ->execute();

    if(isset($items['node'])) {

      foreach(entity_load('node', array_keys($items['node'])) as $item) {

	$item_md = entity_metadata_wrapper('node', $item);
	drush_log(dt("Normalizing the title for " . $item->title . '...'), 'ok');

	$item_md->title->set(preg_replace('//', ' ', $item->title));

	drush_log(dt("Normalized " . $item->title . '...'), 'success');

	//node_save($item);
	$item_md->save(true);
	entity_save('node', $item);
      }
    }
  }
}

function drush_dss_elc_normalize_books() {

  $drupalQuery = new EntityFieldQuery();

  foreach(array('book', 'periodical', 'manifestation', 'item') as $content_type) {

    $items = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', $content_type)
      //->propertyCondition('title', '%' . '&amp;' . '%', 'LIKE')
      //->propertyCondition('title', '%' . '&#039;' . '%', 'LIKE')
      ->propertyCondition('title', '%' . '&%;' . '%', 'LIKE')
      ->execute();

    if(isset($items['node'])) {

      //$item = array_pop(entity_load('node', array_keys($items['node'])));
      foreach(entity_load('node', array_keys($items['node'])) as $item) {

	$item = node_load($item->nid);
	drush_log(dt("Normalizing the title for " . $item->title . '...'), 'ok');

	$item->title = preg_replace('/&amp;/', '&', $item->title);

	//$item->title = preg_replace('/&#039;/', "’", $item->title);
	$item->title = preg_replace('/&#039;/', "'", $item->title);

	//entity_save('node', $item);
	node_save($item);
	drush_log(dt("Normalized the title to " . $item->title . '...'), 'success');
      }
    }
  }
}

function drush_dss_elc_delete_books() {

  drush_print(dt('WARNING: THIS WILL DELETE ALL BOOK, PERIODICAL, MANIFESTATION, AUTHOR, AND AUTHORSHIP NODES WITHIN THE SITE.'));
  if(drush_confirm(dt('Do you wish to continue?'))) {

    $drupalQuery = new EntityFieldQuery();

    foreach(array('book', 'periodical', 'manifestation', 'authorship') as $content_type) {

      $items = $drupalQuery->entityCondition('entity_type', 'node')
	->entityCondition('bundle', $content_type)
	->execute();
    
      if(isset($items['node'])) {

	entity_delete_multiple('node', array_keys($items['node']));
	drush_log(dt("Deleted " . (string) array_keys($items['node']) . '...'), 'success');
      }
    }
  }

  // Retrieve the taxonomy term distinguishing authors
  $author_term = dss_elc_get_taxonomy_term('Author', PERSON_TYPES_TAXON);

  $drupalQuery = new EntityFieldQuery();
      
  $authors = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'human')
    ->fieldCondition('field_person_type', 'tid', intval($author_term->tid))
    ->execute();
  
  if(isset($authors['node'])) {
    
    entity_delete_multiple('node', array_keys($authors['node']));
  }
}


/**
 * Find the location Node captured for Easton, PA (TGN: 2088025)
 * (http://www.getty.edu/vow/TGNFullDisplay?find=Easton&place=&nation=&prev_page=2&english=Y&subjectid=2088025)
 *
 * Hierarchy of North and Central America (continent)  ....  North and Central America (continent) (P)
 * Hierarchy of United States (nation)  ........  United States (nation) (P)
 * Hierarchy of Pennsylvania (state)  ............  Pennsylvania (state) (P)
 * Hierarchy of Northampton (county)  ................  Northampton (county) (P)
 * Hierarchy of Easton (inhabited place)  ....................  Easton (inhabited place) (P) 
 */

function dss_elc_get_easton_location() {

  $drupalQuery = new EntityFieldQuery();
      
  $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'location')
    ->propertyCondition('title', 'Easton');
  
  $locations = $drupalQuery->execute();
  if(isset($locations['node'])) {
    
    return array_pop(entity_load('node', array_keys($locations['node'])));
  } else {

    $easton_entity = entity_create('node', array(
						 'type' => 'location',
						 'uid' => 1,
						 'status' => 1,
						 'comment' => 1,
						 'promote' => 0,
						 ));

    $easton_md = entity_metadata_wrapper('node', $easton_entity);
    $easton_md->title->set('Easton');

    // Set the TGN field name
    $easton_md->field_location_tgn_id->set(dss_elc_get_taxonomy_term('2088025', 'tgn_ids') );

    $easton_md->save(true);
    entity_save('node', $easton_entity);
    
    return $easton_entity;
  }
}


define('SHAREHOLDER', 0);
define('REPRESENTATIVE', 1);

function dss_elc_migrate_get_person_table_name($person_type) {

  switch($person_type) {

  case 0:
    return $table_name = 'shareholders';
    
  case 1:
    return $table_name = 'representatives';
    
  default:
    throw new Exception('Unhandled person type');
  }
}

/**
 * Function for migrating Shareholder or Representative Entities as Human Nodes
 *
 */
function dss_elc_migrate_person_type($db, $limit, $person_type) {

  $table_name = dss_elc_migrate_get_person_table_name($person_type);

  // Retrieve all person records and serialize them as Human Person Nodes
  foreach(drush_dss_elc_get_records($db, $table_name, $limit) as $person) {

    $person_term = dss_elc_get_taxonomy_term($person_type == SHAREHOLDER ? 'Shareholder' : 'Representative', PERSON_TYPES_TAXON);

    $person_name = trim($person['name']);

    echo 'Migrating the ' . ($person_type == SHAREHOLDER ? 'shareholder ' : 'representative ') . $person_name . "...\n";

    // PDO issues related to JOINS
    // Retrieve the person Human
    $drupalQuery = new EntityFieldQuery();
  
    $persons = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'human')
      ->fieldCondition('field_person_name', 'value', $person_name, '=')
      ->execute();
  
    // If the person doesn't exist, create a new person
    if(!isset($persons['node'])) {
    
      $person_entity = entity_create('node', array('type' => 'human',
						   'uid' => 1,
						   'status' => $person['flagStatus'] == '1' ? 0 : 1,
						   'comment' => 1,
						   'promote' => 0,
						   ));

      $person_md = entity_metadata_wrapper('node', $person_entity);

      $person_md->title->set($person_name);
      $person_md->field_person_name->set($person_name);

      // Always set the default location to the "Easton" location Node
      $person_md->field_person_location->set(array(intval(dss_elc_get_easton_location()->nid)));

      // Set the type of the person
      $person_md->field_person_type->set(array(intval($person_term->tid)));

      $person_md->body->set(array('value' => $person['flagMessage']));
    } else {

      // Update the person if they exist
      $person_entity = array_pop(entity_load('node', array_keys($persons['node'])));
      $person_md = entity_metadata_wrapper('node', $person_entity);

      // Add the new type for the person
      $person_md->field_person_type[] = intval($person_term->tid);
    }
    
    $person_md->save(true);
    entity_save('node', $person_entity);
  }

  return $db;
}

/**
 * Hook implementation for migrating Shareholder and Representative Entities from the legacy application
 * @param mysql_user
 * @param mysql_pass
 * @param mysql_database
 * @param mysql_server
 * @param limit
 *
 */
function drush_dss_elc_migrate_humans($mysql_user,
				      $mysql_pass,
				      $mysql_database = 'elc',
				      $mysql_server = 'localhost',
				      $limit = 0) {

  $db = new PDO("mysql:host=$mysql_server;dbname=$mysql_database;charset=utf8",
		$mysql_user,
		$mysql_pass,
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

  $results = dss_elc_migrate_person_type($db, $limit, SHAREHOLDER);
  $results = $results and dss_elc_migrate_person_type($db, $limit, REPRESENTATIVE);
  
  return $results;

  // yum: sudo yum -y install php-mysql
  // Connect to the MySQL server
  $db = new PDO("mysql:host=$mysql_server;dbname=$mysql_database;charset=utf8", $mysql_user, $mysql_pass,
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

  // Retrieve all shareholder records and serialize them as Human Person Nodes


  /*
  foreach(drush_dss_elc_get_records($db, 'shareholders', 1) as $shareholder) {

    echo "Migrating the shareholder " . $shareholder['name'] . "...\n";
    
    $shareholder_entity = entity_create('node', array(
						      'type' => 'human',
						      'uid' => 1,
						      'status' => $shareholder['flagStatus'] == '1' ? 1 : 0,
						      'comment' => 1,
						      'promote' => 0,
						      ));

    $shareholder_md = entity_metadata_wrapper('node', $shareholder_entity);

    $shareholder_md->title->set($shareholder['name']);
    $shareholder_md->field_person_name->set($shareholder['name']);

    // Always set the default location to the "Easton" location Node
    $shareholder_md->field_person_name->set(intval(dss_elc_get_easton_location()));

    $shareholder_md->body->set(array('value' => $shareholder['flagMessage']));
    $shareholder_md->save(true);
    entity_save('node', $shareholder_entity);
  }
  */



  // Retrieve all representative records and instantiate them as Human Person Nodes, as well as instantiate Personal Relationship Nodes
  // Refactor
  /*
  foreach($db->prepare($sql)
	  ->execute(array(':table_name' => 'representatives'))
	  ->fetchAll() as $representative) {

    echo "Migrating the representative " . $representative['name'] . "...\n";
    
    $representative_entity = entity_create('node', array(
							 'type' => 'human',
							 'uid' => 1,
							 'status' => $representative['flagStatus'] == '1' ? 1 : 0,
							 'comment' => 1,
							 'promote' => 0,
							 ));

    $representative_md = entity_metadata_wrapper('node', $representative_entity);

    $representative_md->title->set($representative['name']);
    $representative_md->field_person_name->set($representative['name']);

    $representative_md->body->set(array('value' => $representative['flagMessage']));
    $representative_md->save(true);
    entity_save('node', $representative_entity);
  }
  */
}

function drush_dss_elc_delete_humans() {

  drush_print(dt('WARNING: THIS WILL DELETE ALL HUMAN NODES WITHIN THE SITE.'));
  if(drush_confirm(dt('Do you wish to continue?'))) {

    $drupalQuery = new EntityFieldQuery();
    
    // Implement some manner by which to determine whether or not a human is an author
    $humans = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'human')
      ->execute();
    
    if(isset($humans['node'])) {

      entity_delete_multiple('node', array_keys($humans['node']));      
    }
  }
}

function dss_elc_get_person_record($db, $person_record_id, $person_type) {

  $table_name = dss_elc_migrate_get_person_table_name($person_type);

  // PDOStatement::fetch() is failing to retrieve the results
  // Results cannot be serialized as an array
  foreach($db->query("SELECT name FROM $table_name WHERE id=" . $person_record_id . " LIMIT 1") as $person) {
    
    $person_name = trim($person['name']);
  }

  if(!isset($person_name)) {

    throw new Exception(($person_type == SHAREHOLDER ? 'Shareholder' : 'Representative') . " foreign key $person_record_id cannot be resolved.");
  }
  
  // PDO issues related to JOINS
  // Retrieve the person Human
  $drupalQuery = new EntityFieldQuery();
  
  $persons = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'human')
    ->fieldCondition('field_person_name', 'value', $person_name, '=')
    ->execute();
  
  if(!isset($persons['node'])) {
    
    throw new Exception(($person_type == SHAREHOLDER ? 'Shareholder' : 'Representative') . " $person_name has not been migrated into a Drupal Human Node.");
  }
  
  return array_pop(entity_load('node', array_keys($persons['node'])));
}

function dss_elc_get_user_elc_editor() {

  $query = new EntityFieldQuery();
  $users = $query->entityCondition('entity_type', 'user')
    ->entityCondition('name', 'Easton Library Company Project Researcher')
    ->execute();

  if(isset($users['nodes'])) {

    return array_pop(entity_load('node', array_keys($users['node'])));
  } else {

    $editor_entity = entity_create('user', array('type' => 'main'));
    $editor_entity->name = 'Easton Library Company Project Researcher';
    $editor_entity->mail = 'dss@lafayette.edu';
    $editor_entity->status = 1;
    //$editor_entity->save(true);
    entity_save('node', $editor_entity);

    return $editor_entity;
  }
}

function dss_elc_add_comment_to_node($node_entity, $comment_body, $comment_mtime) {

  $user = dss_elc_get_user_elc_editor();

  $comment = new stdClass();

  $comment->nid = $node->nid;
  $comment->cid = 0;
  $comment->pid = 0;
  $comment->uid = $user->uid;

  $comment->mail = $user->mail;
  $comment->name = $user->name;
  //$comment->thread = '01/'; // OPTIONAL. If you need comments to be threaded you can fill this value. Otherwise omit it.
  //$comment->hostname = '127.0.01' // OPTIONAL. You can log poster's ip here
  $comment->created = $comment_mtime;
  //$comment->is_anonymous = 0;
  $comment->homepage = 'http://elc.lafayette.edu/';
  $comment->status = COMMENT_PUBLISHED;
  $comment->language = LANGUAGE_NONE;
  $comment->subject = 'Data capture notes';
  $comment->comment_body[$comment->language][0]['value'] = $comment_body;
  $comment->comment_body[$comment->language][0]['format'] = 'filtered_html';
  comment_submit($comment);
  comment_save($comment);

  return $node;
}

/**
 * Retrieve an Item, Book, or Periodical Node by the taxonomy term within the "field_volume"
 *
 */
function dss_elc_get_items($book_title, $volume) {

  $items = array();
  $volume_term = dss_elc_get_taxonomy_term($volume, 'item_volumes');

  //foreach(array('item', 'book', 'periodical') as $content_type) {

  $drupalQuery = new EntityFieldQuery();
  $results = $drupalQuery->entityCondition('entity_type', 'node')
    //->entityCondition('bundle', $content_type)
    ->entityCondition('bundle', array('item', 'book', 'periodical'), 'IN')
    //->entityCondition('bundle', 'book')
    //->propertyCondition('title', '%' . $book_title . '%', 'LIKE')
    ->fieldCondition('field_artifact_title', 'value', $book_title)
    //->fieldCondition('field_artifact_title', 'value', $book_title . "%", "LIKE")
    ->fieldCondition('field_item_volume', 'tid', intval($volume_term->tid))
    ->execute();
  
  if(isset($results['node'])) {

    $items = entity_load('node', array_keys($results['node']));
  }
  //}

  return $items;
}

/**
 * Retrieve an Item, Book, or Periodical Node by the taxonomy term within the "field_volume"
 *
 */
function dss_elc_get_manifestation($book_title) {

  $drupalQuery = new EntityFieldQuery();
  $results = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'manifestation')
    ->fieldCondition('field_artifact_title', 'value', $book_title)
    //->fieldCondition('field_artifact_title', 'value', $book_title . "%", "LIKE")
    ->execute();

  if(isset($results['node'])) {

    return array_pop(entity_load('node', array_keys($results['node'])));
  }

  return NULL;
}

/**
 * Retrieve a Book record by its title
 *
 */
function dss_elc_get_book($db, $title) {
  
  $books = array();

  //$query = $db->prepare('SELECT * FROM books WHERE title=? LIMIT 1');
  //foreach($query->execute($title) as $book) {
  foreach($db->query("SELECT * FROM books WHERE title='" . preg_replace("/'/", "\'", $title) . "' LIMIT 1") as $book) {

    $books[] = $book;
  }

  if(empty($books)) {
    
    throw new Exception("Book record with the title $title could not be resolved.");
  }

  return array_shift($books);
}

function dss_elc_get_book_title($db, $book_record_id) {

  foreach($db->query("SELECT title FROM books WHERE id=" . $book_record_id . " LIMIT 1") as $book) {
    
    $book_title = $book['title'];
  }

  if(!isset($book_title)) {
    
    throw new Exception("Book foreign key $book_record_id cannot be resolved.");
  }

  return $book_title;
}

define('LOAN_FILENAMES_TAXON', 'loan_filenames');

/**
 * Hook implementation for migrating Loan Entities from the legacy application
 *
 *
 */
function drush_dss_elc_migrate_loans($mysql_user,
				     $mysql_pass,
				     $mysql_database='elc',
				     $mysql_server='localhost',
				     $limit=0) {

  $db = new PDO("mysql:host=$mysql_server;dbname=$mysql_database;charset=utf8",
		$mysql_user,
		$mysql_pass,
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
  
  foreach(drush_dss_elc_get_records($db, 'loans', $limit) as $loan) {

    $shareholder = dss_elc_get_person_record($db, $loan['shareholder_id'], SHAREHOLDER);

    // Instantiate the Loan Node
    $loan_entity = entity_create('node', array('type' => 'loan',
					       'uid' => 1,
					       'status' => $loan['flagStatus'] == '1' ? 0 : 1,
					       'comment' => 1,
					       'promote' => 0));

    $loan_md = entity_metadata_wrapper('node', $loan_entity);

    // Instantiate personal_representative Nodes for the representative -> shareholder relationship
    if(isset($loan['representative_id']) && trim($loan['representative_id']) != '') {

      try {

	$representative = dss_elc_get_person_record($db, $loan['representative_id'], REPRESENTATIVE);

	//echo 'Migrating the representative relationship between ' . $representative->field_person_name['und'][0]['value'] . ' and ' . $shareholder->field_person_name['und'][0]['value'] . "...\n";
	
	/*
	// Retrieve the "Representative" Role
	$drupalQuery = new EntityFieldQuery();
	
	$drupalQuery->entityCondition('entity_type', 'node')
	  ->entityCondition('bundle', 'role')
	  ->propertyCondition('title', 'Representative');
	
	$result = $drupalQuery->execute();
	if(!isset($result['node'])) {

	  throw new Exception('The role "Representative" has not been instantiated into a Drupal Role Node.');
	}
	$role = array_pop(entity_load('node', array_keys($result['node'])));
	*/

	/*
	$drupalQuery = new EntityFieldQuery();
	
	$result = $drupalQuery->entityCondition('entity_type', 'node')
	  ->entityCondition('bundle', 'personal_relationship')
	  ->entityCondition('field_pers_rel_subject', 'target_id', intval($representative->nid))
	  ->entityCondition('field_pers_rel_object', 'target_id', intval($shareholder->nid))
	  ->entityCondition('field_pers_rel_role', 'tid', intval(dss_elc_get_taxonomy_term('Representative', ROLES_TAXON)->tid))
	  ->execute();

	if(isset($result['node'])) {

	  $pers_rel_entity = array_pop(entity_load('node', array_keys($result['node'])));
	} else {
	
	  // Instantiate the personal_relationship Node
	  $pers_rel_entity = entity_create('node', array(
							 'type' => 'personal_relationship',
							 'uid' => 1,
							 'status' => 1,
							 'comment' => 1,
							 'promote' => 0));
	
	  $pers_rel_md = entity_metadata_wrapper('node', $pers_rel_entity);
	
	  $pers_rel_md->field_pers_rel_subject->set(intval($representative->nid));

	  //$pers_rel_md->field_pers_rel_role->set(intval($role->nid));
	  $pers_rel_md->field_pers_rel_role->set(dss_elc_get_taxonomy_term('Representative', ROLES_TAXON));
	  
	  $pers_rel_md->field_pers_rel_object->set(intval($shareholder->nid));
	  $pers_rel_md->title->set($representative->title . ' is a representative for ' . $shareholder->title);
	
	  // Instantiate the Personal Relationship
	  $pers_rel_md->save(true);
	  entity_save('node', $pers_rel_entity);
	}

	// Update the Representative Human Node
	$representative_md = entity_metadata_wrapper('node', $representative);
	$representative_md->field_human_pers_rels->set(array(intval($pers_rel_entity->nid)));
	entity_save('node', $representative);
	*/

	$subject = $representative;

	if($shareholder->nid != $subject->nid) {

	  $loan_md->field_loan_shareholder->set(intval($shareholder->nid));
	}
      } catch(Exception $e) {
	
	// Should there be an issue related to the deserialization of the "representative" Node, a warning is logged and only the "shareholder" is specified in the Loan Node
	drush_log(dt($e->getMessage()), 'warning');
	$subject = $shareholder;
      }
    } else {

      $subject = $shareholder;
      $loan_md->field_loan_shareholder->set(intval($subject->nid));
    }

    $loan_md->field_bib_rel_subject->set(intval($subject->nid));

    // Normalization
    if($loan['borrowedVolumes']) {

      drush_log(dt('Normalizing the "borrowedVolumes" field ' . $loan['borrowedVolumes'] . "...\n"), 'ok');

      $map = function($borrowed_volumes_field) {

	if(preg_match('/\-/', $borrowed_volumes_field)) { // If this string contains no semicolons

	  return preg_split('/\-/', $borrowed_volumes_field);
	} elseif(preg_match('/,/', $borrowed_volumes_field)) {

	  return preg_split('/,/', $borrowed_volumes_field); // If this is not a range, split on the comma and store the respective volumes as terms
	} elseif(preg_match('/\&/', $borrowed_volumes_field)) { // Split on the ampersand, assume that this is merely a pair (not a range)

	  $volumes = preg_split('/\&/', $borrowed_volumes_field);

	  for($i=0; $i < sizeof($volumes);$i++) {

	    $volumes[$i] = trim($volumes[$i]);
	    
	    if(preg_match('/^\d+$/', $volumes[$i])) {
	      
	      preg_match('/([a-zA-Z\.]+?)\s\d*/', $volumes[$i - 1], $matches);
	      $volumes[$i] = $matches[1] . ' ' . $volumes[$i];
	    }
	  }

	  return $volumes;
	}

	return array($borrowed_volumes_field);
      };

      // "issue;volume;month;year"
      // (https://lafayettecollegelibraries.atlassian.net/wiki/display/EDDC/Notes+on+transcription+for+summer+2013)
      $VOLUME_FIELDS_MAP = array(0 => 'issues',
				 1 => 'volumes',
				 2 => 'months',
				 3 => 'years');

      if(preg_match('/;/', $loan['borrowedVolumes']) ) {

	$volume_fields = preg_split('/;/', $loan['borrowedVolumes']);



	for($i=0;$i < sizeof($volume_fields);$i++) {

	  if(preg_match('/\-/', $volume_fields[$i])) {

	    $s = preg_split('/\-/', $volume_fields[$i]);
	    $volume_fields[$VOLUME_FIELDS_MAP[$i] ] = range($s[0], $s[1]);
	  } elseif(preg_match('/,/', $volume_fields[$i])) {

	    $volume_fields[$VOLUME_FIELDS_MAP[$i] ] = preg_split('/,/', $volume_fields[$i]);
	  } elseif(preg_match('/\[.+?\]/', $volume_fields[$i], $matches)) {
	    
	    // "In cases where issue numbers aren't normally included, we'll count how many issues go in a volume and give the number in brackets (e.g., [43])."
	    // (Ibid.)
	    $volume_fields[$VOLUME_FIELDS_MAP[$i] ] = range(1, $matches[1]);
	  } else {

	    $volume_fields[$VOLUME_FIELDS_MAP[$i] ] = array($volume_fields[$i]);
	  }

	  unset($volume_fields[$i]);
	}

      } else {

	$volume_fields = array('issues' => array(''),
			       'volumes' => array_pop(array_map($map, array($loan['borrowedVolumes']))),
			       'months' => array(''),
			       'years' => array(''));
      }

      try {

	$book_title = dss_elc_get_book_title($db, $loan['book_id']);
      } catch(Exception $e) {

	drush_log(dt('Failed to migrate loan record ' . $loan['id'] . ': ' . $e->getMessage()), 'warning');
	continue;
      }

      // If possible, relate all volumes to the loan
      $items = array();

      foreach($volume_fields['volumes'] as $volume) {

	$book = dss_elc_get_book($db, $book_title);

	$author_name = mb_convert_encoding($original_item['author'], 'UTF-8', 'ASCII');
	$node_book_title = dss_elc_normalize_book_title($book, $book['title'], $volume, $author_name);

	$items = array_merge($items, dss_elc_get_items($node_book_title, $volume));
      }

      // If there are no items related by the volumes specified, simply relate the manifestation (as we cannot relate the items)
      // Extending the data model beyond the depth of "volume" would be trivial and unnecessary; cataloging is outside of the scope of the project
      if(empty($items)) {
	
	$manifestation = dss_elc_get_manifestation($node_book_title);
	$loan_md->field_bib_rel_object->set(array(intval($manifestation->nid)));
	drush_log(dt("Mapped the \"book_id\" foreign key $book_title to a Manifestation Node"), 'ok');
      } else {

	//$loan_md->field_bib_rel_object->set(array_map($map, $items));
	//drush_log(dt("Mapped the \"book_id\" foreign key $book_title to a set of Item Nodes"), 'ok');
	foreach($items as $item) {

	  drush_log(dt("Mapped the \"book_id\" foreign key $book_title to " . $item->title), 'ok');
	  
	  $loan_md->field_bib_rel_object[] = intval($item->nid);
	}
      }

      foreach(array_values($VOLUME_FIELDS_MAP) as $volume_field) {

	if(!empty($volume_fields[$volume_field])) {

	  switch($volume_field) {

	  case 'issues':

	    foreach($volume_fields['issues'] as $field_value) {

	      //field_loan_issues_loaned
	      $loan_md->field_loan_issues_loaned[] = $field_value;
	    }

	    if(!empty($volume_fields['issues'])) {

	      drush_log(dt('Mapped the normalized "borrowedVolumes" issues field value ' . implode(', ', $volume_fields['issues'])), 'ok');
	    }
	    break;
	  case 'volumes':

	    //field_loan_volumes_loaned
	    foreach($volume_fields['volumes'] as $field_value) {

	      $loan_md->field_loan_volumes_loaned[] = $field_value;
	    }

	    if(!empty($volume_fields['volumes'])) {

	      drush_log(dt('Mapped the normalized "borrowedVolumes" volumes field value ' . implode(', ', $volume_fields['volumes'])), 'ok');
	    }
	    break;
	  case 'months':

	    //field_loan_months_loaned
	    foreach($volume_fields['months'] as $field_value) {

	      $loan_md->field_loan_months_loaned[] = $field_value;
	    }

	    if(!empty($volume_fields['months'])) {

	      drush_log(dt('Mapped the normalized "borrowedVolumes" months field value ' . implode(', ', $volume_fields['months'])), 'ok');
	    }
	    break;
	  case 'years':

	    //field_loan_years_loaned
	    foreach($volume_fields['years'] as $field_value) {

	      $loan_md->field_loan_years_loaned[] = $field_value;
	    }

	    if(!empty($volume_fields['years'])) {

	      drush_log(dt('Mapped the normalized "borrowedVolumes" years field value ' . implode(', ', $volume_fields['years'])), 'ok');
	    }
	    break;
	  }
	}
      }

      // Issues with the "date" Module and the Entity API
      // (https://drupal.org/node/1803286)

      /*
      $loan_md->field_checkout = strtotime($loan['checkout']);
      drush_log(dt('Mapped the "checkout" field value ' . $loan['checkout']), 'ok');
      $loan_md->field_returned = strtotime($loan['returned']);
      drush_log(dt('Mapped the "returned" field value ' . $loan['returned']), 'ok');
      */

      $loan_md->field_loan_duration = array('value' => strtotime($loan['checkout']),
					    'value2' => strtotime($loan['returned']));
      drush_log(dt('Mapped the "checkout" field value ' . $loan['checkout']), 'ok');
      drush_log(dt('Mapped the "returned" field value ' . $loan['returned']), 'ok');

      if(isset($loan['filename'])) {

	$loan_md->field_loan_filename->set(intval(dss_elc_get_taxonomy_term($loan['filename'], LOAN_FILENAMES_TAXON)->tid));
	drush_log(dt('Mapped the "filename" field value ' . $loan['filename']), 'ok');
      }

      if(isset($loan['fine'])) {

	$loan_md->field_loan_fine = $loan['fine'];
	drush_log(dt('Mapped the "fine" field value ' . $loan['fine']), 'ok');
      }

      //dss_elc_add_comment_to_node($loan_entity, $loan['flagMessage'], $loan['modified']);
      $loan_md->body->set(array('value' => $loan['flagMessage']));

      /*
    // Normalization
    if($loan['borrowedVolumes']) {

      if(preg_match('/;/', $loan['borrowedVolumes']) ) {
      } elseif(preg_match('/\-/', $loan['borrowedVolumes'])) {
	
	$s = preg_split('/\-/', $loan['borrowedVolumes']);
	foreach(range($s[0], $s[1]) as $volume) {

	  $item = drush_dss_elc_get_item($volume);
	}
      } elseif(preg_match('/,/', $loan['borrowedVolumes'])) {

      }
    } else {

    }
      */


      //exit();

      /*
      exit();

      // Retrieve the personal_relationship Node
      $drupalQuery = new EntityFieldQuery();

      // Work-around
      $drupalQuery->entityCondition('entity_type', 'node')
	->entityCondition('bundle', 'personal_relationship')
	->propertyCondition('title', "$representative_name  was a Representative for ");

      $result = $drupalQuery->execute();
      if(!isset($result['node'])) {

	throw new Exception('The personal_relationship Node has not been serialized.');
      }
      $personal_relationship = array_pop(entity_load('node', array_keys($result['node'])));

      echo 'The Drupal Node ' . $personal_relationship->nid . ' has been serialized';

      // Work-around
      $personal_relationship_node = node_load($personal_relationship->nid);

      var_dump($personal_relationship_node);
      //$personal_relationship_node->title = "$representative_name was a Representative for $shareholder";
      $personal_relationship_node->title = "test";
      node_save($personal_relationship_node);
      exit();
      */
    }

    $loan_md->save(true);
    entity_save('node', $loan_entity);
  }

  // Retrieve all loan records and serialize them as Personal Relationship Nodes
}

function drush_dss_elc_random_loans() {

  $drupalQuery = new EntityFieldQuery();
  
  $result = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'loan')
    //->entityCondition('field_pers_rel_subject', 'target_id', intval($representative->nid))
    //->entityCondition('field_pers_rel_object', 'target_id', intval($shareholder->nid))
    //->entityCondition('field_pers_rel_role', 'tid', intval(dss_elc_get_taxonomy_term('Representative', ROLES_TAXON)->tid))
    ->propertyCondition('status', 0)
    ->range(0, 1000)
    ->execute();

  if(isset($result['node'])) {

    /*
    foreach(entity_load('node', array_keys($result['node'])) as $loan) {

      drush_log('Publishing ' . $loan->title . '...', 'ok');
      $loan->status = 1;
      entity_save('node', $loan);
    }
    */

    $rand_subset = entity_load('node', array_keys($result['node']));
    $rand_indices = array();

    for($i=0;$i<256;$i++) {

      $loan_indices = array_keys($rand_subset);
      $loan_indices[0];
      do {

	$rand_index = rand($loan_indices[0],
			   $loan_indices[count($loan_indices) - 1]);
      } while(in_array($rand_index, $rand_indices));

      $rand_indices[] = $rand_subset;

      $loan = array_pop(entity_load('node', array($rand_index)));

      drush_log('Publishing ' . $loan->title . '...', 'ok');
      $loan->status = 1;

      drush_log('Adding the term "Reviewed" to ' . $loan->title . '...', 'ok');
      $loan_md = entity_metadata_wrapper('node', $loan);

      $term = array_pop(taxonomy_get_term_by_name('Reviewed', 'bib_rel_types'));
      $loan_md->field_bib_rel_type->set(intval($term->tid));

      $loan_md->save(true);
      entity_save('node', $loan);

      drush_log('Saving the Loan ' . $loan->title . '...', 'success');
    }
  }
}

function drush_dss_elc_publish_humans() {

  $drupalQuery = new EntityFieldQuery();
  
  $result = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'human')
    //->entityCondition('field_pers_rel_subject', 'target_id', intval($representative->nid))
    //->entityCondition('field_pers_rel_object', 'target_id', intval($shareholder->nid))
    //->entityCondition('field_pers_rel_role', 'tid', intval(dss_elc_get_taxonomy_term('Representative', ROLES_TAXON)->tid))
    ->propertyCondition('status', 0)
    //->range(0, 1000)
    ->execute();

  if(isset($result['node'])) {
    
    foreach(entity_load('node', array_keys($result['node'])) as $human) {

      drush_log('Publishing ' . $human->title . '...', 'ok');
      $human->status = 1;
      entity_save('node', $human);
    }
  }
}

function drush_dss_elc_publish_items() {

  $drupalQuery = new EntityFieldQuery();

  foreach(array('book', 'periodical') as $bundle) {

    $result = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', $bundle)
      //->entityCondition('field_pers_rel_subject', 'target_id', intval($representative->nid))
      //->entityCondition('field_pers_rel_object', 'target_id', intval($shareholder->nid))
      //->entityCondition('field_pers_rel_role', 'tid', intval(dss_elc_get_taxonomy_term('Representative', ROLES_TAXON)->tid))
      ->propertyCondition('status', 0)
      //->range(0, 1000)
      ->execute();

    if(isset($result['node'])) {
    
      foreach(entity_load('node', array_keys($result['node'])) as $item) {
	
	drush_log('Publishing ' . $item->title . '...', 'ok');
	$item->status = 1;
	entity_save('node', $item);
      }
    }
  }
}

function drush_dss_elc_publish_loans() {

  $drupalQuery = new EntityFieldQuery();
  
  $result = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'loan')
    //->entityCondition('field_pers_rel_subject', 'target_id', intval($representative->nid))
    //->entityCondition('field_pers_rel_object', 'target_id', intval($shareholder->nid))
    //->entityCondition('field_pers_rel_role', 'tid', intval(dss_elc_get_taxonomy_term('Representative', ROLES_TAXON)->tid))
    ->propertyCondition('status', 0)
    ->range(0, 1000)
    ->execute();

  if(isset($result['node'])) {
    
    foreach(entity_load('node', array_keys($result['node'])) as $loan) {

      drush_log('Publishing ' . $loan->title . '...', 'ok');
      $loan->status = 1;
      entity_save('node', $loan);
    }
  }
}

function drush_dss_elc_clean_terms($vocab_name = 'loan_filenames') {

  $vocab = taxonomy_vocabulary_machine_name_load($vocab_name);
  $query = new EntityFieldQuery();

  $result = $query->entityCondition('entity_type', 'taxonomy_term')
    ->propertyCondition('vid', $vocab->vid)
    ->propertyOrderBy('weight')
    ->execute();

  if (!empty($result['taxonomy_term'])) {

    // To load all terms.
    $terms = taxonomy_term_load_multiple(array_keys($result['taxonomy_term']));

    foreach($terms as $term) {

      if( preg_match('/ELCv\d_[A-Z]\d?_[1-9][0-9][a-z]?$/', $term->name) ) {

	drush_log('Cleaning ' . $term->name . '...', 'ok');

	$term->name = preg_replace('/ELCv(\d_[A-Z]\d?)_/', 'ELCv$1_0', $term->name);
	drush_log('Saving the cleaned term ' . $term->name . '...', 'ok');

	taxonomy_term_save($term);
	drush_log('Saved the cleaned term ' . $term->name, 'success');
      }
    }
  }
}

function drush_dss_elc_clean_loans() {

  $drupalQuery = new EntityFieldQuery();
  
  $result = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'loan')
    ->range(0, 1000)
    ->execute();

  if(isset($result['node'])) {
    
    foreach(entity_load('node', array_keys($result['node'])) as $loan) {

      $tid = $loan->field_loan_filename['und'][0]['tid'];
      $term = taxonomy_term_load($tid);

      //if( preg_match('/ELCv\d_[A-Z]_[1-9]/', 'ELCv1_C_1') ) {
      if( preg_match('/ELCv\d_[A-Z]_[1-9]/', $term->name) ) {

	drush_log('Cleaning ' . $loan->title . '...', 'ok');
	print_r($term->name);
	print 'trace';
	exit(1);
      }

      entity_save('node', $loan);
    }
  }
}

function drush_dss_elc_delete_loans() {

  drush_print(dt('WARNING: THIS WILL DELETE ALL LOAN NODES WITHIN THE SITE.'));
  if(drush_confirm(dt('Do you wish to continue?'))) {

    $drupalQuery = new EntityFieldQuery();

    $loans = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'loan')
      ->execute();
    
    if(isset($loans['node'])) {
      
      entity_delete_multiple('node', array_keys($loans['node']));
    }

    /*
    $drupalQuery = new EntityFieldQuery();
    
    $repr_rels = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'personal_relationship')
      ->entityCondition('field_pers_rel_role', 'tid', intval(dss_elc_get_taxonomy_term('Representative', ROLES_TAXON)->tid))
      ->execute();

    if(isset($repr_rels['node'])) {

      entity_delete_multiple('node', array_keys($repr_rels['node']));
    }
    */
  }
}

function drush_dss_elc_ingest_root($root_pid = 'islandora:root', $url = 'http://localhost:8080/fedora') {

  $module_path = drupal_get_path('module', 'islandora');
  
  // Get the connection
  $connection = islandora_get_tuque_connection(user_load(1), $url);

  // Verify that the root Object has not already been ingested
  try {

    $root_collection = $connection->repository->getObject(urldecode($root_pid));

    drush_log('Islandora root Object ' . $root_pid . ' already exists', 'error');
  } catch (Exception $e) {

    if ($e->getCode() == '404') {

      $root_collection = islandora_islandora_required_objects($connection);
      islandora_add_object(array_shift($root_collection['islandora']['objects']));
    
      drush_log('The Islandora root Object ' . $root_pid . ' was successfully ingested', 'success');
    } else {

      drush_log($e->getMessage(), 'error');
      return NULL;
    }
  }
}

function drush_dss_elc_purge_root($root_pid = 'islandora:root', $url = 'http://localhost:8080/fedora') {

  // Get the connection
  $connection = islandora_get_tuque_connection(user_load(1), $url);

  // Verify that the root Object has not already been ingested
  $root_collection = islandora_object_load($root_pid);
  if(!$root_collection || !isset($root_collection)) {

    drush_log('The Islandora root Object ' . $root_pid . ' does not exist', 'error');
  } else {

    $root_collection = islandora_object_load($root_pid);
    islandora_delete_object($root_collection);
    drush_log('Islandora root Object ' . $root_pid . ' was successfully purged', 'success');
  }
}

function drush_dss_elc_metrics_network() {

  /*
  //$redis = new Predis\Client('tcp://10.0.0.1:6379');
  $redis = Redis_Client::getClient();
  */

  /*
  $collection = mongodb_collection($this->bin);
  // Garbage collection necessary when enforcing a minimum cache lifetime.
  $this->garbageCollection($this->bin);
  $cache = $collection->findOne(array('_id' => (string)$cid));
  return $this->prepareItem($cache);
  */

  $params = array('loan', array('125645'), '-5005047600', '-4859982000');

  $collection = mongodb_collection('dss_elc_metrics');
  $mongo_id = json_encode($params);

  $data = $collection->findOne(array('_id' => $mongo_id));
  //$data = $redis->get(json_encode($params));

  //if(!isset($data)) {
  if(!$data || !isset($data['data'])) {

    $object = dss_elc_metrics_network('loan', array('125645'), '-5005047600', '-4859982000');

    //$redis->set(json_encode($params), json_encode($object));

    $entry = array('_id' => $mongo_id,
		   'cid' => $mongo_id,
		   //'created' => REQUEST_TIME,
		   //'expire' => $expire,
		   //'serialized' => !$scalar,
		   //'data' => $scalar ? $data : serialize($data),
		   'data' => $object);

    $collection->save($entry);

    $data = $object;
  } else {

    print_r('trace');
  }

  //print_r($data);
}
