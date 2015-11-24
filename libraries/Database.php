<?php namespace ELC;


class Database {

  private $db;
  private $books;
  private $shareholders;
  private $representatives;

  public function __construct($mysql_user,
			      $mysql_pass,
			      $mysql_database='elc',
			      $mysql_server='localhost') {

    $this->db = new \PDO("mysql:host=$mysql_server;dbname=$mysql_database;charset=utf8", $mysql_user, $mysql_pass);
    $this->books = array();
    $this->shareholders = array();
    $this->representatives = array();
  }

  public function query($query) {
    return $this->db->query($query);
  }

  /**
   *
   */
  public function book($book_id) {

    print "TRACE01:";
    print_r($book_id);
    print "TRACE02\n\n";

    if(!array_key_exists($book_id, $this->books)) {
      $query = "SELECT * FROM books WHERE id=$book_id";
      $records = $this->db->query($query);

      foreach( $records as $record ) {
	$book = $record;
	$this->books[$book_id] = $book;
      }
    } else {
      $book = $this->books[$book_id];
    }

    return new Book($book, $this);
  }

  /**
   *
   */
  public function shareholder($shareholder_name) {
    if(!array_key_exists($shareholder_name, $this->shareholders)) {
      $query = "SELECT * FROM shareholders WHERE name='$shareholder_name'";
      $records = $this->db->query($query);

      foreach( $records as $record ) {
	$shareholder = $record;
	$this->shareholders[$shareholder_name] = $shareholder;
      }
    } else {
      $shareholder = $this->shareholders[$shareholder_name];
    }

    return new Shareholder($shareholder, $this);
  }

  /**
   *
   */
  public function representative($representative_name) {
    if(!array_key_exists($representative_name, $this->representatives)) {
      $query = "SELECT * FROM representatives WHERE name='$representative_name'";
      $records = $this->db->query($query);

      foreach( $records as $record ) {
	$representative = $record;
	$this->representatives[$representative_name] = $representative;
      }
    } else {
      $representative = $this->representatives[$representative_name];
    }

    return new Representative($representative, $this);
  }

  }
