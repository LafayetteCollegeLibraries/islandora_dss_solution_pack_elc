<?php

  //dpm('trace13');
?>

<div class="loan-record">
<?php if($form): ?>

<div class="loan-row">
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_title']); ?>
</div>

<div class="book-column single-value-field column-item-format">
   <?php print drupal_render_children($form['field_item_format']); ?>
</div>
<div class="book-column single-value-field column-item-book-periodical">
   <?php print drupal_render_children($form['field_book_or_periodical']); ?>
</div>

<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_item_number_taxon']); ?>
</div>
</div>

<div class="loan-row">
<div class="book-column single-value-field column-item-author">
   <?php print drupal_render_children($form['field_artifact_was_authored_by']); ?>
</div>
</div>

<div class="loan-row">
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_item_subject']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_external_record']); ?>
</div>
</div>

<div class="loan-row">
<div class="book-column single-value-field body-field">
    <?php print drupal_render_children($form['body']); ?>
</div>
</div>

<div class="loan-row loan-row-final">
<div class="book-column">
    <?php print drupal_render_children($form); ?>
</div>
</div>

<?php endif ?>
</div>
