<?php namespace ELC;

class Record {
  public $id;
  public $flag_status;
  public $flag_message;
  public $review;
  public $created;
  public $modified;

  protected $db;

  public function __construct($record, $db) {

    $this->id = $record['id'];
    $this->flag_status = $record['flagStatus'];
    $this->flag_message = $record['flagMessage'];
    $this->review = $record['review'];
    $this->created = $record['created'];
    $this->modified = $record['modified'];

    $this->db = $db;
  }
}
