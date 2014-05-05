<?php

define('PERSON_TYPES_TAXON', 'person_types');

  /**
   * Refactor into the data access
   */
function dss_elc_get_persons($field, $value, $contentType='person', $personType=NULL) {

  $drupalQuery = new EntityFieldQuery();

  if(isset($personType)) {

    $person_term = dss_elc_get_taxonomy_term($personType, PERSON_TYPES_TAXON);

    $humans = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', $contentType)
      ->fieldCondition($field, 'value', $value)
      ->fieldCondition('field_person_type', 'tid', $person_term->tid)
      ->execute();
  } else {

    $humans = $drupalQuery->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', $contentType)
      ->fieldCondition($field, 'value', $value)
      ->execute();
  }
  
  if(isset($humans['node'])) {
    
    return entity_load('node', array_keys($humans['node']));
  }
  }

/**
 * Retrieve or create a new human Node for a given name and person type
 *
 */
function dss_elc_get_human($name, $personType=NULL) {
  
  $results = dss_elc_get_persons('field_person_name', $name, 'human', $personType);
  
  // If the human Node doesn't exist, ensure that it does exist by searching for the name
  // (Also, ensure that authors and shareholders/representatives bearing the same name are not integrated into the same Node)
  if(empty($results)) {

    if($personType != 'Author') {

      $results = dss_elc_get_persons('field_person_name', $name, 'human');
    }
  } else {

    // 
    $human_entity = array_pop($results);
    $human_md = entity_metadata_wrapper('node', $human_entity);
    $human_term = dss_elc_get_taxonomy_term($personType, PERSON_TYPES_TAXON);
    //$human_md->field_person_type->set(array(intval($human_term->tid)));
    $human_md->field_person_type[] = intval($human_term->tid);

    // Refactor
    $human_md->save(true);
    entity_save('node', $human_entity);

    return $human_entity;
  }

  // If the human Node doesn't exist, create the Node
  if(empty($results)) {

    $human_entity = entity_create('node', array(
						'type' => 'human',
						'uid' => 1,
						'status' => 1,
						'comment' => 1,
						'promote' => 0,
						));

    $human_md = entity_metadata_wrapper('node', $human_entity);

    $human_md->title->set($name);
    $human_md->field_person_name->set($name);

    if(isset($personType)) {

      $human_term = dss_elc_get_taxonomy_term($personType, PERSON_TYPES_TAXON);
      $human_md->field_person_type->set(array(intval($human_term->tid)));
    }

    // Serialize the human Node
    $human_md->save(true);
    entity_save('node', $human_entity);

    return $human_entity;
  } else {

    return array_pop($results);
  }
}

function dss_elc_migrate_author($author_name, $frbr_entities) {

  // More Unicode errors from PDO
  $author_name = mb_convert_encoding($author_name, "UTF-8", 'ASCII');

  $author_term = dss_elc_get_taxonomy_term('Author', PERSON_TYPES_TAXON);

  // Determine whether the author exists
  $drupalQuery = new EntityFieldQuery();
      
  $drupalQuery->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'human')
    ->fieldCondition('field_person_name', 'value', $author_name, '=')
    ->fieldCondition('field_person_type', 'tid', intval($author_term->tid));
  
  $authors = $drupalQuery->execute();
  if(isset($authors['node'])) {
    
    $author_entity = array_pop(entity_load('node', array_keys($authors['node'])));

    $author_md = entity_metadata_wrapper('node', $author_entity);
  } else {

    drush_log(dt("Migrating the author " . $author_name), 'ok');

    $author_entity = entity_create('node', array(
						 'type' => 'human',
						 'uid' => 1,
						 'status' => 1,
						 'comment' => 1,
						 'promote' => 0,
						 ));

    $author_md = entity_metadata_wrapper('node', $author_entity);

    $author_md->title->set($author_name);
    $author_md->field_person_name->set($author_name);

    // Refine the data models by distinguishing the other solely through an 'author' taxonomy term
    $author_md->field_person_type->set(array(intval($author_term->tid)));
  }

  // Instantiate the authorship Node
  $authorship_entity = entity_create('node', array(
						   'type' => 'authorship',
						   'uid' => 1,
						   'status' => 1,
						   'comment' => 1,
						   'promote' => 0));

  $authorship_md = entity_metadata_wrapper('node', $authorship_entity);

  // Serialize the human Node
  $author_md->save(true);
  entity_save('node', $author_entity);

  // The "title" field for the human Node cannot be resolved until the Node is serialized
  $authorship_md->field_bib_rel_subject->set(intval($author_entity->nid));

  // auto_nodetitle appends a single space
  $title = $author_entity->title . " authored " . $frbr_entities[0]->title;
  $title = preg_replace('/\s\(Manifestation\)$/', '', $title);

  if(strlen($title) > 254) {
      
    $authorship_md->title->set(substr($title, 0, 251) . '...');
  } else {
      
    $authorship_md->title = $title;
  }

  foreach($frbr_entities as $frbr_entity) {

    $authorship_md->field_bib_rel_object[] = intval($frbr_entity->nid);
  }

  // Serialize the authorship Node
  $authorship_md->save(true);
  entity_save('node', $authorship_entity);
  
  return $author_entity;
}
