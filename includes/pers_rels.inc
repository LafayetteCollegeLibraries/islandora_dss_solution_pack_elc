<?php

/**
 * This retrieves a Personal Relationship Node from the database
 * @author griffinj@lafayette.edu
 */
function dss_elc_get_pers_rels($subjectNid, $depth=1) {

  $subject = dss_elc_get_node('nid', $subjectNid);

  switch($subject->type) {

  case 'human':

    $pers_rel_nids = $subject->field_human_pers_rels[$subject->language];
    break;
    
  default:
    
    $pers_rel_nids = array();
    break;
  }

  $pers_rels = array();
  foreach($pers_rel_nids as $pers_rel_nid) {

    // dss_elc_get_node($field, $value, $contentType=NULL, $entityField=0) {
    $edge = dss_elc_get_node('nid', $pers_rel_nid);

    $edge->field_pers_rel_subject[$edge->language][0] = $subject;
    $edge->field_pers_rel_role[$edge->language][0] = taxonomy_term_load($edge->field_pers_rel_role[$edge->language][0]['tid']);

    $edge->field_pers_rel_object[$edge->language][0] = dss_elc_get_node('nid', $edge->field_pers_rel_object[$edge->language][0]['target_id']);

    $pers_rels[] = $edge;

    // This will ultimately refactored into the Drupal 7 triple store
    /*
    $pers_rels[] = array('subject' => $subject,
			 'predicate' => $edge,
			 'object' => dss_elc_get_node('nid', $predicate->field_pers_rel_object->nid)
			 );
    */
  }

  return $pers_rels;
}

/**
 * Update personal_relationship nodes
 * @author griffinj@lafayette.edu
 *
 */
function dss_elc_update_pers_rels($representativeNid, $shareholderNid, $role='Representative') {

  // If there are no existing personal relationships between the shareholder and representative nodes...
  // Does a personal relationship exist?
  $drupalQuery = new EntityFieldQuery();
  
  $result = $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'personal_relationship')
    ->fieldCondition('field_pers_rel_subject', 'target_id', $representativeNid)
    ->fieldCondition('field_pers_rel_object', 'target_id', $shareholderNid)
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
    
    $pers_rel_md->field_pers_rel_subject->set(intval($representativeNid));
    
    $pers_rel_md->field_pers_rel_role->set(dss_elc_get_taxonomy_term($role, ROLES_TAXON));
    
    $pers_rel_md->field_pers_rel_object->set(intval($shareholderNid));
    $pers_rel_md->title = 'testPersonalRelationship';
    
    // Instantiate the Personal Relationship
    $pers_rel_md->save(true);
    entity_save('node', $pers_rel_entity);
  }

  $representative_entity = array_pop(entity_load('node', array($representativeNid)));
  $representative_md = entity_metadata_wrapper('node', $representative_entity);

  // Only append the personal relationship to the subject Node if it has not already been appended
  $map = function($pers_rel) {

    return $pers_rel->nid;
  };
  if(!in_array(intval($pers_rel_entity->nid), array_map($map, $representative_md->field_human_pers_rels->value()))) {

    $representative_md->field_human_pers_rels[] = intval($pers_rel_entity->nid);
  }

  $representative_md->save(true);
  entity_save('node', $representative_entity);
}
