<?php namespace ELC;

class Loan extends Record {

  public $book;
  public $shareholder;
  public $representative;
  public $filename;
  public $borrowed_volumes;
  public $checkout;
  public $returned;
  public $fine;
  public $note;

  public function __construct($record, $db, $book = NULL, $shareholder = NULL, $representative = NULL) {
    parent::__construct($record, $db);

    $this->filename = $record['filename'];
    $this->borrowed_volumes = $this->normalize_volumes($record['borrowedVolumes']);
    $this->checkout = $record['checkout'];
    $this->returned = $record['returned'];
    $this->fine = $record['fine'];
    $this->note = $record['note'];

    $this->book = $book;
    $this->shareholder = $shareholder;
    $this->representative = $representative;
  }

  /**
   * @todo Refactor into a magic method
   */
  public function normalize_volumes($volumes) {
    $map = function($borrowed_volumes_field) {
      if(preg_match('/\s?part\s(\d)/', $borrowed_volumes_field, $matches)) { // More anomalous structures for borrowed volumes
	$borrowed_volumes_field = $matches[1];

      } if(preg_match('/\-/', $borrowed_volumes_field)) { // If this string contains no semicolons
	return preg_split('/\-/', $borrowed_volumes_field);

      } elseif(preg_match('/,/', $borrowed_volumes_field)) {
	return preg_split('/,/', $borrowed_volumes_field); // If this is not a range, split on the comma and store the respective volumes as terms

      } elseif(preg_match('/\&/', $borrowed_volumes_field)) { // Split on the ampersand, assume that this is merely a pair (not a range)
	$parsed_volumes = preg_split('/\&/', $borrowed_volumes_field);

	for($i=0; $i < sizeof($parsed_volumes);$i++) {

	  $parsed_volumes[$i] = trim($parsed_volumes[$i]);
	    
	  if(preg_match('/^\d+$/', $parsed_volumes[$i])) {
	      
	    preg_match('/([a-zA-Z\.]+?)\s\d*/', $parsed_volumes[$i - 1], $matches);
	    $parsed_volumes[$i] = $matches[1] . ' ' . $parsed_volumes[$i];
	  }
	}

	return $parsed_volumes;
      }

      return array($borrowed_volumes_field);
    };

    // "issue;volume;month;year"
    // (https://lafayettecollegelibraries.atlassian.net/wiki/display/EDDC/Notes+on+transcription+for+summer+2013)
    $VOLUME_FIELDS_MAP = array(0 => 'issues',
			       1 => 'volumes',
			       2 => 'months',
			       3 => 'years');

    if(preg_match('/;/', $volumes) ) {

      $volume_fields = preg_split('/;/', $volumes);

      for($i=0;$i < sizeof($volume_fields);$i++) {
	
	if(preg_match('/\-/', $volume_fields[$i])) {

	  $s = preg_split('/\-/', $volume_fields[$i]);
	    $volume_fields[$VOLUME_FIELDS_MAP[$i] ] = range($s[0], $s[1]);
	} elseif(preg_match('/,/', $volume_fields[$i])) {
	  
	  $volume_fields[$VOLUME_FIELDS_MAP[$i] ] = preg_split('/,/', $volume_fields[$i]);
	} elseif(preg_match('/\[.+?\]/', $volume_fields[$i], $matches)) {
	  
	  // "In cases where issue numbers aren't normally included, we'll count how many issues go in a volume and give the number in brackets (e.g., [43])."
	  // (Ibid.)
	  $volume_fields[$VOLUME_FIELDS_MAP[$i] ] = range(1, $matches[1]);
	} else {

	  $volume_fields[$VOLUME_FIELDS_MAP[$i] ] = array($volume_fields[$i]);
	}

	unset($volume_fields[$i]);
      }

    } else {

      $volume_fields = array('issues' => array(''),
			     'volumes' => array_pop(array_map($map, array($volumes))),
			     'months' => array(''),
			     'years' => array(''));
    }

    return $volume_fields['volumes'];
  }
  }
