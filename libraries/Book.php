<?php namespace ELC;

class Book extends Record {
  public $title;
  public $authors;
  public $format;
  public $number;
  public $total_volumes;
  public $subject;
  public $type;
    
  public function __construct($record, $db, $authors = NULL) {
    parent::__construct($record, $db);
    $this->title = $record['title'];

    switch($record['format']) {

    case '0':
	    
      $record['format'] = 'Octavo';
      break;

    case '1':

      $record['format'] = 'Quarto';
      break;

    case '2':

      $record['format'] = 'Duodecimo';
      break;

    default:

      $record['format'] = $record['format'];
      break;
    }
    $this->format = $record['format'];

    $this->number = $record['number'];

    $this->total_volumes = $record['totalVolumes'];
    $this->subject = $record['subject'];
    $this->type = $record['type'];
    //$this->author = is_null($author) ? new Author($record['author']) : $author;

    if(!is_null($authors)) {
      $this->authors = $authors;
    } else {
      $this->authors = array();

      foreach(preg_split('/;/', $record['author']) as $author_name) {
	$this->authors[] = new Author($author_name);
      }
    }
  }

  /*
  public function normalize_title($title, $author) {
    if(preg_match('', '')
  }
  */
}
