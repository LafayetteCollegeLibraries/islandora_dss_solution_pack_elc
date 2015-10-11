<?php

/**
 * Globals
 *
 */
define('FIELD_TYPE_ENTITY_REF', 1);
define('FIELD_TYPE_ENTITY', 2);

/**
 * This retrieves a Person Node from the database
 * @author griffinj@lafayette.edu
 *
 */
function dss_elc_get_node($field, $value, $contentType=NULL, $entityField=0) {

  $query = new EntityFieldQuery();

  // For retrieval by the NID...
  if($field == 'nid') {

    if(!isset($contentType)) {

      $entities = $query->entityCondition('entity_type', 'node', '=')
	->propertyCondition($field, $value)
	->range(0,1)
	->execute();
    } else {

      $entities = $query->entityCondition('entity_type', 'node', '=')
	->entityCondition('type', $contentType)
	->propertyCondition($field, $value)
	->range(0,1)
	->execute();
    }
  } else {

    // If the content type is not specified (but the field is)...
    if(!isset($contentType)) {

      $entities = $query->entityCondition('entity_type', 'node', '=')
	->entityCondition($field, $value)
	->range(0,1)
	->execute();
    } else {

      // Retrieve by content type name and field in all other cases
      $entities = $query->entityCondition('entity_type', 'node', '=')
	->entityCondition('type', $contentType)
	->fieldCondition($field, 'value', $value)
	->range(0,1)
	->execute();
    }
  }

  if(!empty($entities['node'])) {

    return node_load(array_shift(array_keys($entities['node'])));
  } else {

    // Deprecated: Use "restws"
    return '{}';
  }
}

/**
 * Retrieve Nodes by Field value and Content Type
 *
 */
function dss_elc_get_nodes($contentType=NULL, $field=NULL, $value=NULL, $entityField) {

  $query = new EntityFieldQuery();

  // For entityreference fields
  // To be refactored
  if(isset($entityField)) {

    switch($entityField) {

    case FIELD_TYPE_ENTITY_REF:

      if(!isset($contentType)) {

	$entities = $query->entityCondition('entity_type', 'node', '=')
	  ->fieldCondition($field, 'target_id', $value)
	  ->execute();
      } else {

	$entities = $query->entityCondition('entity_type', 'node', '=')
	  ->propertyCondition('type', $contentType)
	  ->fieldCondition($field, 'target_id', $value)
	  ->execute();

      }
      break;

    case FIELD_TYPE_ENTITY:

      if(!isset($contentType)) {

	$entities = $query->entityCondition('entity_type', 'node', '=')
	  ->fieldCondition($field, 'value', $value)
	  ->execute();
      } else {

	$entities = $query->entityCondition('entity_type', 'node', '=')
	  ->propertyCondition('type', $contentType)
	  ->fieldCondition($field, 'value', $value)
	  ->execute();

      }
      break;

    default:

      return array();
    }
  } elseif(isset($value) && isset($field)) {

    if(isset($contentType)) {

      $entities = $query->entityCondition('entity_type', 'node', '=')
	->propertyCondition('type', $contentType)
	->propertyCondition($field, $value)
	->execute();
    } else {

      $entities = $query->entityCondition('entity_type', 'node', '=')
	->propertyCondition($field, $value)
	->execute();
    }
  } else {

    // Retrieve all entities of a given content type
    $entities = $query->entityCondition('entity_type', 'node', '=')
      ->propertyCondition('type', $contentType)
      ->execute();
  }

  if(!empty($entities['node'])) {

    return entity_load('node', array_keys($entities['node']));
  } else {

    return array();
  }
}

/**
 * Retrieve the value of a single node field
 *
 */
define('FIELD_TYPE_DATE', 1);
function dss_elc_get_node_field($node, $field, $fieldType) {

  switch($fieldType) {

  case FIELD_TYPE_DATE:

  default:

    return $node->$field[$node->language][0];
    break;
  }
}
