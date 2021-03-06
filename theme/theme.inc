<?php

/**
 * Implements hook_preprocess_node_form().
 * Operations common to all form preprocessing hooks
 *
 */
function dss_elc_preprocess_node_form(&$vars) {

  hide($vars['form']['additional_settings']);

  // Determine whether or not this is in response to an AJAX request
  if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $vars['form']['actions']['publish']['#value'] = t('Save Record');
  }

  if( preg_match('/edit$/', $vars['form']['#action']) ) {
    $bundle = ucfirst($vars['form']['#bundle']);
    drupal_set_title("Edit $bundle");
  }
}

/**
 * Implements hook_preprocess_page().
 *
 */
function dss_elc_preprocess_page(&$vars) {

  if (!empty($vars['page']['content']['system_main']['#form_id']) && $vars['page']['content']['system_main']['#form_id'] == 'item_node_form') {
    if( preg_match('/edit$/', $vars['page']['content']['system_main']['#action']) ) {
      $bundle = ucfirst($vars['page']['content']['system_main']['#bundle']);
      drupal_set_title("Edit $bundle");
    }
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

  $autocomplete_fields = array('personal_relationship' => array('entity' => array(
										  array('selector' => array("#edit-field-pers-rel-subject-und"),
											'options' => array()
											),
										  array('selector' => array("#edit-field-pers-rel-object-und"),
											'options' => array()
											),
										  ),
								)
			       );
  $fields = variable_get('dss_elc_autocomplete_fields', $autocomplete_fields);
  $pers_rel_fields = $fields['personal_relationship'];

  $field_types = array(
		       'loans' => 'DssElcAutocompleteLoan',
		       'entityRefs' => 'DssElcAutocompleteEntityRef',
		       'terms' => 'DssElcAutocomplete'
		       );

  drupal_add_js(array('dssElcAutocomplete' => array('fieldTypes' => $field_types,
						    'fields' => $pers_rel_fields)), 'setting');

  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/dss_elc_autocomplete.js');

  drupal_add_js(array('dssElc' => array('isAjaxRequest' => false)), 'setting');
  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/node_modal.js');
  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/node.js');

  hide($variables['form']['field_pers_rel_type']);
  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);
}

function template_preprocess_item_node_form(&$variables) {

  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/item_form.js');

  hide($variables['form']['field_artifact_metadata_record']);
  hide($variables['form']['field_item_embodies']);
  hide($variables['form']['field_item_volume_migrate']);
  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);
  hide($variables['form']['field_book_or_periodical'][$variables['form']['field_book_or_periodical']['#language']]['_none']);
  
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

    if(array_key_exists('isModalQuery', $_GET) and $_GET['isModalQuery']) {

      $variables['form']['field_human_pers_rels'] = array();
      $variables['form']['field_person_location'] = array();
      $variables['form']['field_person_membership'] = array();
      $variables['form']['field_human_occupation'] = array();
    }

  } else {

    drupal_add_js(array('dssElc' => array('isAjaxRequest' => false)), 'setting');

    $autocomplete_fields = array('human' => array('entity' => array(array(
									  'selector' => array("#edit-field-person-membership-und"),
									  'options' => array()
									  ),
								    array(
									  'selector' => array("#edit-field-person-location-und"),
									  'options' => array()
									  ),
								    ),
						  'term' => array(array(
									'selector' => array("#edit-field-human-occupation-und"),
									'options' => array()
									),
								  array(
									'selector' => array("#edit-field-person-type-und"),
									'options' => array()
									),
								  ),
						  ));
    $fields = variable_get('dss_elc_autocomplete_fields', $autocomplete_fields);
    $human_fields = $fields['human'];

    $field_types = array('loans' => 'DssElcAutocompleteLoan',
			 'entityRefs' => 'DssElcAutocompleteEntityRef',
			 'terms' => 'DssElcAutocomplete'
			 );

    drupal_add_js(array('dssElcAutocomplete' => array('fieldType' => $field_types,
						      'fields' => $human_fields)), 'setting');

    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/dss_elc_autocomplete.js');

    drupal_add_js(array('dssElcPersRelsField' => array('button' => 'button[name="field_human_pers_rels_add_more"]')), 'setting');
    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/dss_elc_pers_rels.js');

    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/human_form.js');
    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/node_modal.js');
    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/node.js');
    drupal_add_css(drupal_get_path('module', 'dss_elc') . '/css/human_form.css');
  }

  /**
   * Invocations of hide() remove the needed AJAX integration for the JavaScript
   *
   */
  $variables['form']['field_pers_rel_role']['#attributes']['style'] = 'display:none';
  $variables['form']['field_pers_rel_object']['#attributes']['style'] = 'display:none';
  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);
}

/**
 * Preprocessor for loan_node_form
 * Implements template_preprocess_FORM_ID_node_form().
 *
 */
function template_preprocess_loan_node_form(&$variables) {

  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/loan_form.js');

  $autocomplete_fields = array(
			       'loan' => array(
					       'loan' => array(
								array(
								      'selector' => array('[id^="edit-field-bib-rel-object-und"].form-text:first'),
								      'options' => array()
								      ),
							       ),
					       'entity' => array(
								 array(
								       'selector' => array("#edit-field-loan-shareholder-und"),
								       'options' => array()
								       ),
								 array(
								       'selector' => array("#edit-field-bib-rel-subject-und"),
								       'options' => array()
									   ),
								 ),
					       'term' => array(
							       array(
								     'selector' => array("#edit-field-loan-filename-und"),
								     'options' => array('filterAutocomplete' => TRUE)
								     ),
							       array(
								     'selector' => array("#edit-field-loan-notes-und"),
								     'options' => array()
								     ),
							       array(
								     'selector' => array("#edit-field-bib-rel-type-und"),
								     'options' => array()
								     )
							       )
					       )
			       );
  $fields = variable_get('dss_elc_autocomplete_fields', $autocomplete_fields);
  $loan_fields = $fields['loan'];

  $field_types = array(
		       'loans' => 'DssElcAutocompleteLoan',
		       'entityRefs' => 'DssElcAutocompleteEntityRef',
		       'terms' => 'DssElcAutocomplete'
		       );

  drupal_add_js(array('dssElcAutocomplete' => array('fieldTypes' => $field_types,
						    'fields' => $loan_fields)), 'setting');
  drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/dss_elc_autocomplete.js');

  if(strpos($variables['form']['#action'], 'multi_node_add') == 0) {

    drupal_add_js(drupal_get_path('module', 'dss_elc') . '/js/src/node.js');
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

  hide($variables['form']['field_loan_other_notes'][$variables['form']['field_loan_other_notes']['#language']][0]['format']);
  hide($variables['form']['body'][$variables['form']['body']['#language']][0]['format']);
}

/**
 * Implements hook_process_theme().
 */
function dss_elc_process_islandora_book_pages_grid(array &$variables) {

  /**
   * Terrible work-around for bug on elc.prod.lafayette.edu
   * (Disabling securelogin does not prevent all traffic from being forced over the HTTPS; Likely a config. setting stuck in the site caches)
   * @todo Properly resolve and remove this
   *
   */
  foreach($variables['pages'] as $pid => &$values) {

    $object_url = "//digital.lafayette.edu/islandora/object/$pid";
    $img = theme_image(array('path' => url("$object_url/datastream/TN/view"), 'attributes' => array()));

    $object_url = "islandora/object/$pid";
    $values['image'] = l($img, $object_url, array('html' => TRUE, 'attributes' => array('title' => $values['label'])));
  }
}

/**
 * Implements hook_process_theme().
 *
 */
function dss_elc_process_islandora_book_book(array &$variables) {

  module_load_include('inc', 'islandora_book', 'theme/theme');
  islandora_book_preprocess_islandora_book_pages($variables);

  /*
  module_load_include('inc', 'islandora_paged_content', 'includes/utilities');
  $object = $variables['object'];
  $params = array(
    'object' => $object,
    'pages' => islandora_paged_content_get_pages($object),
    'page_progression' => islandora_paged_content_get_page_progression($object),
  );
  module_load_include('inc', 'islandora', 'includes/solution_packs');
  $viewer = islandora_get_viewer($params, 'islandora_book_viewers');
  if ($viewer) {
    $variables['viewer'] = $viewer;
  }

  try {

    $dc = $object['DC']->content;
    $dc_object = DublinCore::importFromXMLString($dc);
  } catch (Exception $e) {

    drupal_set_message(t('Error retrieving object %s %t', array('%s' => $object->id, '%t' => $e->getMessage())), 'error', FALSE);
  }
  $variables['dc_array'] = isset($dc_object) ? $dc_object->asArray() : array();
  */
}
