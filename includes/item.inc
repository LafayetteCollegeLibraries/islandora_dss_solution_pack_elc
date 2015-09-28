<?php

function dss_elc_book_normalize_format($book) {

  /**
   * Ensure that the title is mapped to the proper value
   *
   */
  switch($book['format']) {

  case '0':

    $book['format'] = 'Octavo';
    break;

  case '1':

    $book['format'] = 'Quarto';
    break;

  case '2':

    $book['format'] = 'Duodecimo';
    break;

  default:

    $book['format'] = $book['format'];
    break;
  }

  return $book;
  }

function dss_elc_book_normalize_title($book_title, $book_author, $title_suffix) {

  $book_title = mb_convert_encoding($book_title, "UTF-8", 'ASCII');
  $book_title = html_entity_decode($book_title);

  // Normalize in response to EDDC-514
  if( preg_match('/^Works(.+)/', $book_title, $book_title_match) ) {

    $book_author_names = explode($book_author, ',');
    $book_author_surname = array_pop($book_author_names);

    $book_title = $book_author_surname . "'" . substr($book_author_surname, -1) === 's' ? '' : 's' . " Works" . $book_title_match[1];
  }

  $book_title = utf8_decode($book_title);

  // Resolves EDDC-530
  $book_title = preg_replace('/—/', '-', $book_title);

  // Resolve length issues
  if(strlen($book_title) > (254 - strlen($title_suffix))) {

    $book_node_title = substr($book_title, 0, 128) . '...' . $title_suffix;
  } else {

    $book_node_title = $book_title . $title_suffix;
  }

  return $book_node_title;
}

function dss_elc_book_normalize_author($book) {

  $book_author = mb_convert_encoding($book['author'], 'UTF-8', 'ASCII');
  $book_author = html_entity_decode($book_author);

  return $book_author;
}

function dss_elc_manifestation_normalize_title($book) {

  $book = dss_elc_book_normalize_format($book);
  $book_author = dss_elc_book_normalize_author($book);

  // Ensure that the format and catalog number are formatted for the title
  $title_suffix = ' (' . $book['format'] . ' ' . $book['number'] . ')';

  $normalized_title = dss_elc_book_normalize_title($book['title'], $book_author, $title_suffix);

  return $normalized_title;
}

function dss_elc_items_by_manifestation($manifestation) {

  // Does the related Manifestation exist?
  $drupalQuery = new EntityFieldQuery();

  $result = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', array('item', 'book', 'periodical'), 'IN')
    ->fieldCondition('field_item_embodies', 'target_id', $manifestation->nid)
    ->execute();

  $items = array();

  if(isset($result['node'])) {

    $items = entity_load('node', array_keys($result['node']));
  }

  return $items;
  }

/**
 * Operations for the node before it is saved
 *
 */
function dss_elc_item_node_presave($node) {

  $itemTitle = $node->field_artifact_title[$node->language][0]['value'];

  /**
   * @author stathisw@lafayette.edu
   *
   */
  //removing duplicate authors
  if(property_exists($node, 'field_artifact_was_authored_by')) {

    foreach($node->field_artifact_was_authored_by['und'] as $key => $value){

      for($comp_key = $key + 1; $comp_key < count($node->field_artifact_was_authored_by['und']); $comp_key ++ ){

	if($value['target_id'] == $node->field_artifact_was_authored_by['und'][$comp_key]['target_id']){

	  unset($node->field_artifact_was_authored_by['und'][$comp_key]);
	}
      }
    }
  }

  // Append the volume number to the node title field
  if(isset($node->field_item_volume) && isset($node->field_item_volume[$node->language][0])) {

    /**
     * @todo Implement for Item title generation
     *
     */
    $volumeTerm = taxonomy_term_load($node->field_item_volume[$node->language][0]['tid']);
    //$format = $book_md->field_item_format;

    //$node->title = $itemTitle . ' (Vol. ' . $volumeTerm->name . ')';
    //$book_title = $book_title . ' [Vol. ' . (string) $book_volume . '] (' . $book['format'] . ' ' . $book['number'] . ')';
    //$node->title = $itemTitle . ' [Vol. ' . $volumeTerm->name . '] (' . $book['format'] . ' ' . $book['number'] . ')';

    $node->title = $itemTitle . ' [Vol. ' . $volumeTerm->name . ']';
  }

  // If this does not have a Manifestation explicitly defined...
  if(!property_exists($node, 'field_item_embodies')) {

    // Does the related Manifestation exist?
    $drupalQuery = new EntityFieldQuery();

    $result = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'manifestation')
      ->fieldCondition('field_artifact_title', 'value', $itemTitle)
      ->execute();

    if(isset($result['node'])) {

      $manifest_entity = array_pop(entity_load('node', array_keys($result['node'])));
    } else { // If the Manifestation does not exist...

      // Instantiate the personal_relationship Node
      $manifest_entity = entity_create('node', array(
						     'type' => 'manifestation',
						     'uid' => 1,
						     'status' => 1,
						     'comment' => 1,
						     'promote' => 0));

      $manifest_md = entity_metadata_wrapper('node', $manifest_entity);

      // Set the title for the Manifestation
      $manifest_md->field_artifact_title->set($itemTitle);

      // Set the author for the Manifestation

      if(property_exists($node, 'field_artifact_was_authored_by')) {

	//$manifest_md->field_artifact_was_authored_by->set(intval($node->field_artifact_was_authored_by[$node->language][0]['target_id']));
	$manifest_md->field_artifact_was_authored_by[] = intval($node->field_artifact_was_authored_by[$node->language][0]['target_id']);
      }

      // Issue with node_auto_title
      $manifest_md->title = $itemTitle;

      $manifest_md->save(true);
      entity_save('node', $manifest_entity);
    }

    // Establish the FRBR relationship between the book/periodical/item Node and the Manifestation Node
    $node->field_item_embodies[$node->language][0]['target_id'] = intval($manifest_entity->nid);
  }
  }

function dss_elc_item_node_insert($node) {

  // Only update the authorship Node if an author was specified
  if(property_exists($node, 'field_artifact_was_authored_by')) {

    $author_entity = array_pop(entity_load('node',array(intval($node->field_artifact_was_authored_by[$node->language][0]['target_id']))));

    // Has the authorship been serialized?
    $drupalQuery = new EntityFieldQuery();

    $result = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'authorship')
      ->fieldCondition('field_bib_rel_subject', 'target_id', $author_entity->nid)
      ->fieldCondition('field_bib_rel_object', 'target_id', $node->nid)
      ->execute();

    if(isset($result['node'])) {

      $authorship_entity = array_pop(entity_load('node', array_keys($result['node'])));
    } else {

      // Instantiate the authorship Node for Authors
      $authorship_entity = entity_create('node', array('type' => 'authorship',
						       'uid' => 1,
						       'status' => 1,
						       'comment' => 1,
						       'promote' => 0));

      $authorship_md = entity_metadata_wrapper('node', $authorship_entity);

      // Set the author as 1 (Array, 1 elemthe subject
      //$authorship_md->field_bib_rel_subject->set(intval($node->field_artifact_was_authored_by[$node->language][0]['target_id'] ));
      $authorship_md->field_bib_rel_subject->set(intval($author_entity->nid ));

      // auto_nodetitle appends a single space
      $objectTitle = substr($node->title, 0, 63) . '...';

      //$title = $author_entity->title . " authored " . $objectTitle;
      //$title = preg_replace('/\s\(Manifestation\)$/', '', $title);

      $authorship_md->title = $author_entity->title . " authored " . $objectTitle;
    }

    // Set the authored works as the objects
    $authorship_md->field_bib_rel_object[] = intval($node->nid);

    // Instantiate the Personal Relationship
    $authorship_md->save(true);
    entity_save('node', $authorship_entity);
  }
}

/**
 * Retrieve all Manifestation Nodes which are linked to items of a given Item (by the Node ID)
 *
 */
function dss_elc_manifestations_ajax() {

  $manifestations = array();
  foreach(func_get_args() as $item_nid) {

    $item = node_load($item_nid);

    if(!empty($item->field_item_embodies[$item->language]) and array_key_exists('target_id', $item->field_item_embodies[$item->language][0])) {

      $manifestations[] = node_load($item->field_item_embodies[$item->language][0]['target_id']);
    }
  }

  drupal_json_output($manifestations);
}
