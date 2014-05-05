<?php

  /**
   * Operations for the node before it is saved
   *
   */

function dss_elc_item_node_presave($node) {

  $itemTitle = $node->field_artifact_title[$node->language][0]['value'];

  // Append the volume number to the node title field
  if(isset($node->field_item_volume) && isset($node->field_item_volume[$node->language][0])) {
    
    $volumeTerm = taxonomy_term_load($node->field_item_volume[$node->language][0]['tid']);
    
    $node->title = $itemTitle . ' (Vol. ' . $volumeTerm->name . ')';
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
      //$manifest_md->field_artifact_was_authored_by->set(intval($node->field_artifact_was_authored_by[$node->language][0]['target_id']));
      $manifest_md->field_artifact_was_authored_by[] = intval($node->field_artifact_was_authored_by[$node->language][0]['target_id']);

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

  $author_entity = array_pop(entity_load('node',
					 array(intval($node->field_artifact_was_authored_by[$node->language][0]['target_id']))));

  $drupalQuery = new EntityFieldQuery();

  $result = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'authorship')
    ->fieldCondition('field_bib_rel_subject', 'target_id', $author_entity->nid)
    ->fieldCondition('field_bib_rel_object', 'target_id', $node->nid)
    ->execute();
  
  // Has the authorship been serialized?
  if(isset($result['node'])) {
    
    $authorship_entity = array_pop(entity_load('node', array_keys($result['node'])));
  } else {
    
    // Instantiate the authorship Node for Authors
    $authorship_entity = entity_create('node', array(
						     'type' => 'authorship',
						     'uid' => 1,
						     'status' => 1,
						     'comment' => 1,
						     'promote' => 0));
      
    $authorship_md = entity_metadata_wrapper('node', $authorship_entity);
      
    // Set the author as the subject
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
