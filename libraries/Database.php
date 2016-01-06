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

  public function books_where($condition) {
    $query = "SELECT * FROM books WHERE $condition";
    $records = $this->db->query($query);

    $books = array();
    foreach( $records as $record ) {
      $books[] = new Book($record, $this);
    }

    return $books;
  }

  /**
   *
   */
  public function loans($limit = NULL, $offset = NULL) {
    $loans = array();
    $query = "SELECT l.* FROM loans AS l INNER JOIN shareholders AS s ON s.id=l.shareholder_id INNER JOIN representatives AS r ON r.id=l.representative_id INNER JOIN books AS b ON b.id=l.book_id";

    if(!is_null($offset)) {
      $query .= " LIMIT $offset,$limit";
    } elseif(!is_null($limit)) {
      $query .= " LIMIT $limit";
    }

    $records = $this->db->query($query);

    foreach( $records as $record ) {
      $loans[] = new Loan($record, $this, $this->book($record['book_id']), $this->shareholder($record['shareholder_id']), $this->representative($record['representative_id']));
    }

    return $loans;
  }

  /**
   * This must support book title, shareholder and representative names
   *
   */
  public function loans_where($condition) {
    $loans = array();
    $query = "SELECT l.* FROM loans AS l INNER JOIN shareholders AS s ON s.id=l.shareholder_id INNER JOIN representatives AS r ON r.id=l.representative_id INNER JOIN books AS b ON b.id=l.book_id WHERE $condition";

    $records = $this->db->query($query);

    foreach( $records as $record ) {
      $loans[] = new Loan($record, $this, $this->book($record['book_id']), $this->shareholder($record['shareholder_id']), $this->representative($record['representative_id']));
    }

    return $loans;
  }

  /**
   *
   */
  public function shareholder($id) {
    if(!array_key_exists($id, $this->shareholders)) {
      $query = "SELECT * FROM shareholders WHERE id='$id'";
      $records = $this->db->query($query);

      foreach( $records as $record ) {
	$shareholder = $record;
	$this->shareholders[$id] = $shareholder;
      }
    } else {
      $shareholder = $this->shareholders[$id];
    }

    return new Shareholder($shareholder, $this);
  }

  /**
   *
   */
  public function shareholders_where($condition) {
    $shareholders = array();
    $query = "SELECT * FROM shareholders WHERE $condition";
    $records = $this->db->query($query);

    foreach( $records as $record ) {
      $shareholders[] = new Shareholder($loan, $this);
    }

    return $shareholders;
  }

  public function representatives_where($condition) {
    $representatives = array();
    $query = "SELECT * FROM representatives WHERE $condition";
    $records = $this->db->query($query);

    foreach( $records as $record ) {
      $representatives[] = new Representative($loan, $this);
    }

    return $representatives;
  }

  /**
   *
   */
  public function representative($id) {
    if(!array_key_exists($id, $this->representatives)) {
      $query = "SELECT * FROM representatives WHERE id='$id'";
      $records = $this->db->query($query);

      foreach( $records as $record ) {
	$representative = $record;
	$this->representatives[$id] = $representative;
      }
    } else {
      $representative = $this->representatives[$id];
    }

    return new Representative($representative, $this);
  }

  }
