<?php

/**
 * This retrieves a Bibliographic Relationship Node from the database
 * @author griffinj@lafayette.edu
 */
function dss_elc_get_bib_rels($subjectNid) {

  $subject = dss_elc_get_node('nid', $subjectNid);

  $bib_rel_nids = array();
  $map = function($node) {

    return $node->nid;
  };

  foreach(array('bibliographic_relationship', 'loan') as $bib_rel_child_node_type) {

    // Not a bidirectional network
    $bib_rel_nids = array_merge($bib_rel_nids, array_map($map, dss_elc_get_nodes('field_bib_rel_subject', intval($subject->nid), $bib_rel_child_node_type, 1)));
  }

  $bib_rels = array();
  foreach($bib_rel_nids as $bib_rel_nid) {

    // dss_elc_get_node($field, $value, $contentType=NULL, $entityField=0) {
    $edge = dss_elc_get_node('nid', $bib_rel_nid);

    $edge->field_bib_rel_subject[$edge->language][0] = $subject;

    $edge->field_bib_rel_object[$edge->language][0] = dss_elc_get_node('nid', $edge->field_bib_rel_object[$edge->language][0]['target_id']);

    $bib_rels[] = $edge;

    // This will ultimately refactored into the Drupal 7 triple store
    /*
    $bib_rels[] = array('subject' => $subject,
			 'predicate' => $edge,
			 'object' => dss_elc_get_node('nid', $predicate->field_bib_rel_object->nid)
			 );
    */
  }

  return $bib_rels;
}

/**
 * Generate the title for any given Node
 * @param node $loan The Loan Node
 *
 * @return string The normalized title of the Loan Node
 */
function dss_elc_loan_node_title($loan) {

  $subject = dss_elc_get_node('nid', $loan->field_bib_rel_subject[$loan->language][0]['target_id'], 'human');
  $object = dss_elc_get_node('nid', $loan->field_bib_rel_object[$loan->language][0]['target_id']);

  // Retrieve the formatted date
  $subject_title = substr($subject->title, 0, 100);
  $object_title = substr($object->title, 0, 100);
  $field_loan_duration_value = $loan->field_loan_duration[$loan->language][0]['value'];

  if(preg_match('/(.*?)T/', $loan->field_loan_duration[$loan->language][0]['value'], $matches)) {

    $loan_title = $subject_title . ' borrowed ' . $object_title . ' on ' .  $matches[1];
  } else {

    $loan_title = $subject_title . ' borrowed ' . $object_title . ' on ' .  date('Y/m/d', $field_loan_duration_value);
  }

  return $loan_title;
}

/**
 * Functionality for parsing nodes
 * Implements hook_node_presave().
 *
 */
function dss_elc_loan_node_presave($node) {

  // If the subject of the loan relationship (i. e. the Representative) field is empty...
  if(empty($node->field_bib_rel_subject[$node->language])) {
    
    $node->field_bib_rel_subject[$node->language][] = $node->field_loan_shareholder[$node->language][0];
  } elseif(property_exists($node, 'field_loan_shareholder') && array_key_exists($node->language, $node->field_loan_shareholder)) {

    // If the shareholder and representative are specified, and are not identical to one another...
    if($node->field_bib_rel_subject[$node->language][0]['target_id'] != $node->field_loan_shareholder[$node->language][0]['target_id']) {

      // ...instantiate the personal relationship for these individuals
      dss_elc_update_pers_rels(intval($node->field_bib_rel_subject[$node->language][0]['target_id']), intval($node->field_loan_shareholder[$node->language][0]['target_id']));
    }
  }
    
  // Override the title
  $node->title = dss_elc_loan_node_title($node);

  // Properly format the datestamps for the field_loan_duration field
  // Resolves EDDC-486

  // This function can be invoked recursively
  // Attempt to reformat the ISO-formatted datestamp into a POSIX datestamp
  if( !preg_match('/^\d{10}$/', $field_loan_duration_value) ) {

    $field_loan_duration_date = DateTime::createFromFormat('Y-m-d*H:i:s', $field_loan_duration_value);

    // If the parsing of the datestamp as failed, log an error
    if( $field_loan_duration_date === FALSE ) {

      //drupal_set_message(t('Improperly formatted check-out date: !datestamp', array('!datestamp' => $field_loan_duration_value) ), 'error');
      watchdog('dss_elc', 'Improperly formatted check-out date: !datestamp', array('!datestamp' => $field_loan_duration_value), WATCHDOG_ERROR);
    } else {

      // This must be extended for anomalous cases in which the datestamp is a negative value
      // Resolves EDDC-506
      $field_loan_duration_value = $field_loan_duration_date->format('U');

      if(substr($field_loan_duration_value, 0, 1) != '-') {

	$field_loan_duration_value = '00' . $field_loan_duration_value;
      }

      $node->field_loan_duration[$node->language][0]['value'] = $field_loan_duration_value;

      $field_loan_duration_value2 = $node->field_loan_duration[$node->language][0]['value2'];

      // For cases in which the terminal value for the loan duration range was unspecified, set the value to an empty string
      if($field_loan_duration_value2 == '0000-00-00T00:00:00') {
	
	$field_loan_duration_value2 = '';
      } else {

	$field_loan_duration_date2 = DateTime::createFromFormat('Y-m-d*H:i:s', $field_loan_duration_value2);

	if($field_loan_duration_date2 === FALSE) {

	  //drupal_set_message(t('Improperly formatted check-in date: !datestamp', array('!datestamp' => $field_loan_duration_value2) ), 'error');
	   watchdog('dss_elc', 'Improperly formatted check-out date: !datestamp', array('!datestamp' => $field_loan_duration_value), WATCHDOG_ERROR);
	} else {

	  //$field_loan_duration_value2 = '00' . $field_loan_duration_date2->format('U');

	  // Resolves EDDC-506
	  $field_loan_duration_value2 = $field_loan_duration_date2->format('U');

	  if(substr($field_loan_duration_value2, 0, 1) != '-') {

	    $field_loan_duration_value2 = '00' . $field_loan_duration_value2;
	  }
	}
      }

      $node->field_loan_duration[$node->language][0]['value2'] = $field_loan_duration_value2;
    }
  }
}
