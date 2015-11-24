<?php namespace ELC;

class Book extends Record {
  public $title;
  public $author;
  public $format;
  public $number;
  public $total_volumes;
  public $subject;
  public $type;
    
  public function __construct($record, $db, $author = NULL) {
    parent::__construct($record, $db);
    $this->title = $record['title'];
    $this->format = $record['format'];
    $this->number = $record['number'];
    $this->total_volumes = $record['totalVolumes'];
    $this->subject = $record['subject'];
    $this->type = $record['type'];
    $this->author = is_null($author) ? new Author($record['author']) : $author;
  }

  /*
  public function normalize_title($title, $author) {
    if(preg_match('', '')
  }
  */
}
