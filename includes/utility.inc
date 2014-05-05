<?php

/**
 * Retrieve a taxonomy term
 * @author griffinj@lafayette.edu
 *
 */
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
