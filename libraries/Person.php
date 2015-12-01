<?php namespace ELC;
const MALE = 0;
const FEMALE = 1;

class Author {
  public $name;

  public function __construct($name) {
    $this->name = $name;
  }
}

class Person extends Record {
  public $name;
  public $gender;
  public $family_name;
    
  public function __construct($record, $db) {
    parent::__construct($record, $db);
    $this->id = $record['id'];
    $this->name = trim($record['name']);
    $this->flag_status = $record['flagStatus'];
    $this->flag_message = $record['flagMessage'];
    $this->review = $record['review'];
    $this->created = $record['created'];
    $this->modified = $record['modified'];
    $this->gender = $record['gender'];
    $this->family_name = $record['familyName'];
    $this->db = $db;
  }
}

class Shareholder extends Person {
  public function select_loans_where($condition) {
    $loans = array();
    $query = "SELECT * FROM loans WHERE shareholder_id={$this->id} AND $condition";
    $records = $this->db->query($query);
    
    if(!empty($records)) {
      foreach($records as $record) {

	// Retrieve the book
	$loans[] = new Loan($record, $this->db, $this->db->book($record['book_id']), $this, $this->db->representative($record['representative_id']));
      }
    }

    return $loans;
  }

}

class Representative extends Person {

}
