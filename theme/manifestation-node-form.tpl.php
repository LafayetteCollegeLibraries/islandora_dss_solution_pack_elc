<div class="loan-record">
<?php if($form): ?>

<div class="loan-row">
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_title']); ?>
</div>
</div>

<div class="loan-row">
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_manifest_total_vol']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_metadata_record']); ?>
</div>
<div class="book-column single-value-field">
   <?php print drupal_render_children($form['field_artifact_type']); ?>
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
