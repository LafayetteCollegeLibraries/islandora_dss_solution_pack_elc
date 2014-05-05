<?php

/**
 * Operations common to all form preprocessing hooks
 */
function dss_elc_preprocess_node_form(&$variables) {

  //drupal_add_js(libraries_get_path('jquery-tokeninput') . '/build/jquery.tokeninput.min.js');
  //drupal_add_js(libraries_get_path('jquery-tokeninput') . '/src/jquery.tokeninput.js');

  // bootstrap-tokenfield/js/
  //drupal_add_js(libraries_get_path('bootstrap-tokenfield') . '/js/bootstrap-tokenfield.js');
  drupal_add_js(libraries_get_path('jquery.token-field') . '/javascripts/jquery.token-field.js');

  hide($variables['form']['additional_settings']);
  #$variables['form']['actions']['submit']['#value'] = 'Submit for Review';
  #$variables['form']['actions']['publish']['#value'] = 'Save';
  }

/**
 * Preprocessor for node_form
 */
function template_preprocess_location_node_form(&$variables) {

  //hide($variables['form']['additional_settings']);
  dss_elc_preprocess_node_form($variables);
  }

function template_preprocess_organization_node_form(&$variables) {

  //hide($variables['form']['additional_settings']);
  dss_elc_preprocess_node_form($variables);
  }

function template_preprocess_personal_relationship_node_form(&$variables) {

  //hide($variables['form']['additional_settings']);
  dss_elc_preprocess_node_form($variables);
  }

function template_preprocess_item_node_form(&$variables) {

  hide($variables['form']['field_artifact_type']);
  hide($variables['form']['field_artifact_metadata_record']);
  hide($variables['form']['field_item_embodies']);
  hide($variables['form']['field_item_volume_migrate']);

  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);

  //hide($variables['form']['additional_settings']);
  dss_elc_preprocess_node_form($variables);
  }

function template_preprocess_human_node_form(&$variables) {

  //print dpm($variables);
  // $variables['form']['#action'] = '/node/add/human'

  // div#page div#content div#console div.error

  drupal_add_library('system', 'ui.dialog');
  dss_elc_preprocess_node_form($variables);

  /*
    This does not function as documented: (https://drupal.org/node/304258#drupal-settings and https://drupal.org/node/224333#local_settings_behaviors)
  drupal_add_js(array('dssElc' => array('isAjaxRequest' => (string)(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') )), 'setting');
  */

  if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

    //drupal_add_js(drupal_get_path('module', 'dss_elc') . '/theme/js/ajaxNode.js');
  } else {
    
    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/theme/js/node.js');
  }
  
  /*
  $variables['field_is_pers_related_to'] = array();
  $variables['field_relates_to'] = array();
  $variables['location'] = array();

  // Restrict the ability to add relationships for the "add" action
  if($variables['form']['#action'] != '/node/add/human') {

    $variables['field_is_pers_related_to'][] = $variables['form']['field_is_pers_related_to'];
    $variables['field_relates_to'][] = $variables['form']['field_relates_to'];
    $variables['location'][] = $variables['form']['field_person_location'];
  }
  
  hide($variables['form']['field_is_pers_related_to']);
  hide($variables['form']['field_relates_to']);
  hide($variables['form']['field_person_location']);
  */

  //hide($variables['form']['additional_settings']);
  //$variables['form']['actions']['publish']['#value'] = 'Save';

  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);
}


/**
 * Preprocessor for loan_node_form
 */
function template_preprocess_loan_node_form(&$variables) {



  if(strpos($variables['form']['#action'], 'multi_node_add') == 0) {

    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/theme/js/node.js');    
  }

  if(!strpos($variables['form']['#action'], 'edit')) {

    // Issue
    //hide($variables['form']['field_loan_ledger']);
    $variables['form']['field_loan_ledger'] = NULL;
  }

  hide($variables['form']['field_loan_ledger']);


  //drupal_add_library('system', 'ui.datepicker');
  drupal_add_library('system', 'ui.dialog');

  dss_elc_preprocess_node_form($variables);

  hide($variables['form']['field_loan_issues_loaned']);

  dpm($variables);

  //$variables['subject'][] = $variables['form']['field_bib_rel_subject'];
  //hide($variables['form']['field_bib_rel_subject']);

  //$variables['object'][] = $variables['form']['field_bib_rel_object'];
  //hide($variables['form']['field_bib_rel_object']);



  //hide($variables['form']['additional_settings']);
  //$variables['form']['actions']['publish']['#value'] = 'Save';

  /*
  $variables['sidebar'] = array();   // Put taxonomy fields in sidebar.

  $variables['sidebar'][] = $variables['form']['field_tags'];
  hide($variables['form']['field_tags']);

  // Extract the form buttons, and put them in independent variable.
  $variables['buttons'] = $variables['form']['actions'];
  hide($variables['form']['actions']);
  */
  }