<div class="loan-record">
<?php if($form): ?>

<div class="loan-row">
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_item_format']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_item_number']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_item_volume_migrate']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_type']); ?>
</div>
</div>

<div class="loan-row">
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_was_authored_by']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_title']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_item_subject']); ?>
</div>
</div>

<div class="loan-row">
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_metadata_record']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_item_embodies']); ?>
</div>
</div>

<div class="loan-row">
<div class="book-column single-value-field">
    <?php print drupal_render_children($form['body']); ?>
</div>
</div>

<div class="loan-row">
<div id="edit-actions" class="form-actions form-wrapper">
   <?php print drupal_render_children($form['actions']); ?>
</div>
</div>

<div class="book-column">
    <?php print drupal_render_children($form); ?>
</div>

<?php endif ?>
</div>
