<?php

/**
 * Operations common to all form preprocessing hooks
 */
function dss_elc_preprocess_node_form(&$variables) {

  //drupal_add_js(libraries_get_path('jquery-tokeninput') . '/build/jquery.tokeninput.min.js');
  //drupal_add_js(libraries_get_path('jquery-tokeninput') . '/src/jquery.tokeninput.js');

  // bootstrap-tokenfield/js/
  //drupal_add_js(libraries_get_path('bootstrap-tokenfield') . '/js/bootstrap-tokenfield.js');
  //drupal_add_js(libraries_get_path('jquery.token-field') . '/javascripts/jquery.token-field.js');

  hide($variables['form']['additional_settings']);
  #$variables['form']['actions']['submit']['#value'] = 'Submit for Review';

  if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

    $variables['form']['actions']['publish']['#value'] = 'Save New Record';
  } else {

    $variables['form']['actions']['publish']['#value'] = 'Save Record';
  }
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

/**
 * Theming for the Personal Relationship form
 *
 */
function template_preprocess_personal_relationship_node_form(&$variables) {

  drupal_add_library('system', 'ui.dialog');
  dss_elc_preprocess_node_form($variables);

  $autocomplete_fields = array('entityRefs' => array('#edit-field-pers-rel-subject-und', '#edit-field-pers-rel-object-und'),
			       //'terms' => array("#edit-field-pers-rel-role-und", '#edit-field-pers-rel-type-und')
			       );
  drupal_add_js(array('dssElcAutocomplete' => array('fields' => $autocomplete_fields)), 'setting');
  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/dss_elc_autocomplete_loan.js');

  drupal_add_js(array('dssElc' => array('isAjaxRequest' => false)), 'setting');
  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/build/node_modal.min.js');
  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/build/node.min.js');

  hide($variables['form']['field_pers_rel_type']);
  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);
}

function template_preprocess_item_node_form(&$variables) {

  hide($variables['form']['field_artifact_type']);
  hide($variables['form']['field_artifact_metadata_record']);
  hide($variables['form']['field_item_embodies']);
  hide($variables['form']['field_item_volume_migrate']);

  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);
  hide($variables['form']['field_book_or_periodical'][$variables['form']['field_book_or_periodical']['#language']]['_none']);
  
  //hide($variables['form']['additional_settings']);
  dss_elc_preprocess_node_form($variables);
  }

/**
 * Form submission handler for the add_more submission within field_human_pers_rels
 *
 */
function dss_elc_field_human_pers_rels_add_more_submit($form, &$form_state) {

  $new_field = array('add_more' => $form_state['field_human_pers_rels'][$form_state['field_human_pers_rels']['#language']]['add_more']);
  unset($form_state['field_human_pers_rels'][$form_state['field_human_pers_rels']['#language']]['add_more']);

  foreach($form_state['field_human_pers_rels'] as $key => $value) {

    $new_field[$key] = $value;
  }
  $form_state['field_human_pers_rels'] = $new_field;
}

function template_preprocess_human_node_form(&$variables) {

  // $variables['form']['#action'] = '/node/add/human'

  // div#page div#content div#console div.error

  drupal_add_library('system', 'ui.dialog');
  dss_elc_preprocess_node_form($variables);

  

  /*
    This does not function as documented: (https://drupal.org/node/304258#drupal-settings and https://drupal.org/node/224333#local_settings_behaviors)
  drupal_add_js(array('dssElc' => array('isAjaxRequest' => (string)(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') )), 'setting');
  */

  /**
   * This must be adjusted for the actual request
   *
   */

  if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

    drupal_add_js(array('dssElc' => array('isAjaxRequest' => true)), 'setting');

    //drupal_add_js(drupal_get_path('module', 'dss_elc') . '/theme/js/ajaxNode.js');

    if(array_key_exists('isModalQuery', $_GET) and $_GET['isModalQuery']) {

      /*
      hide($variables['form']['field_human_pers_rels']);
      hide($variables['form']['field_person_location']);
      hide($variables['form']['field_person_membership']);
      hide($variables['form']['field_human_occupation']);
      */
      $variables['form']['field_human_pers_rels'] = array();
      $variables['form']['field_person_location'] = array();
      $variables['form']['field_person_membership'] = array();
      $variables['form']['field_human_occupation'] = array();
    }
  } else {

    drupal_add_js(array('dssElc' => array('isAjaxRequest' => false)), 'setting');

    $autocomplete_fields = array(
				 //'persRels' => array('[id^="field-human-pers-rels-values"]'),
				 'entityRefs' => array('#edit-field-person-membership-und', '#edit-field-person-location-und'),
				 'terms' => array("#edit-field-human-occupation-und", '#edit-field-person-type-und')
				 );
    drupal_add_js(array('dssElcAutocomplete' => array('fields' => $autocomplete_fields)), 'setting');
    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/dss_elc_autocomplete_loan.js');

    drupal_add_js(array('dssElcPersRelsField' => array('button' => 'button[name="field_human_pers_rels_add_more"]')), 'setting');
    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/dss_elc_pers_rels.js');

    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/build/human_form.min.js');
    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/build/node_modal.min.js');
    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/build/node.min.js');
    drupal_add_css(drupal_get_path('module', 'dss_elc') . '/css/human_form.css');
  }

  /**
   * Invocations of hide() remove the needed AJAX integration for the JavaScript
   *
   */
  $variables['form']['field_pers_rel_role']['#attributes']['style'] = 'display:none';
  $variables['form']['field_pers_rel_object']['#attributes']['style'] = 'display:none';

  //hide($variables['form']['field_pers_rel_role']);
  //hide($variables['form']['field_pers_rel_object']);
  
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

  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/build/loan_form.min.js');

  $autocomplete_fields = array('loans' => array('[id^="edit-field-bib-rel-object-und"].form-text'),
			       'entityRefs' => array("#edit-field-loan-shareholder-und", "#edit-field-bib-rel-subject-und"),
			       'terms' => array("#edit-field-loan-filename-und", "#edit-field-loan-notes-und", "#edit-field-bib-rel-type-und")
			       );
  drupal_add_js(array('dssElcAutocomplete' => array('fields' => $autocomplete_fields)), 'setting');
  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/dss_elc_autocomplete_loan.js');

  if(strpos($variables['form']['#action'], 'multi_node_add') == 0) {

    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/build/node.min.js');
  }

  if(!strpos($variables['form']['#action'], 'edit')) {

    // Issue
    //hide($variables['form']['field_loan_ledger']);
    $variables['form']['field_loan_ledger'] = NULL;
  }

  //drupal_add_library('system', 'ui.datepicker');
  drupal_add_library('system', 'ui.dialog');
  dss_elc_preprocess_node_form($variables);

  hide($variables['form']['field_loan_ledger']);
  hide($variables['form']['field_loan_issues_loaned']);
  //$variables['form']['field_loan_issues_loaned'] = array();

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

  hide($variables['form']['field_loan_other_notes'][$variables['form']['field_loan_other_notes']['#language']][0]['format']);
  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);
}

/**
 * Implements template_preprocess_page()
 * Integrate the necessary JavaScript widgets necessary for specific Content Types of Nodes
 *
 */
function dss_elc_preprocess_page(&$variables) {

  /**
   * Integrate the stylesheets for the DataTables plug-in
   */
  drupal_add_css(libraries_get_path('DataTables') . '/media/css/jquery.dataTables.css');

  if(isset($variables['page']) && isset($variables['page']['content']['system_main']['#type'])) {
    if($variables['page']['content']['system_main']['#type'] == 'form') {

      switch($variables['page']['content']['system_main']['#form_id']) {

      case 'loan_node_form':
      case 'human_node_form':
      case 'item_node_form':
      case 'book_node_form':
      case 'periodical_node_form':

	$variables['page']['content']['system_main']['actions']['publish']['#value'] = t('Save');
      break;
      
      default:
	break;
      }
    }
  } elseif(isset($variables['node'])) {

    switch($variables['node']->type) {
      
    case 'loan':
    case 'item':
    case 'book':
    case 'periodical':
    default:
      
      break;
    }
  }
}

function dss_elc_preprocess_html(&$vars) {

  dpm($vars);
}

/**
 * Implement template_preprocess_views_view().
 *
 */
function dss_elc_preprocess_views_view(&$vars) {

  /**
   * Work-around for avoiding JS caching issues for dss_elc_preprocess_views_view() implementation
   * See html.tpl.php for bootstrap_dss_elc theme
   * @todo Resolve EDDC-160
   *
   */
  //drupal_add_js(libraries_get_path('DataTables') . '/media/js/jquery.dataTables.js');
  //drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/build/dss_elc_views_filter.min.js');
}
