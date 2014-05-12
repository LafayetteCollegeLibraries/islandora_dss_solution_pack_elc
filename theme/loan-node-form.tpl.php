
<div class="loan-record">
<?php if($form): ?>
<div class="loan-row">

<div id="loan-fields-a">


<div class="filename-column loan-column single-value-field">
    <?php print drupal_render_children($form['field_loan_filename']); ?>
</div>

<div class="loan-persons">
<div class="shareholder-column loan-column single-value-field">
    <?php print drupal_render_children($form['field_loan_shareholder']); ?>
</div>
<div class="patron-column loan-column single-value-field">
    <?php print drupal_render_children($form['field_bib_rel_subject']); ?>
</div>
</div>
<div class="loan-persons-add">
  <div class="node-add-shareholder form-item"><button class="add-node-modal btn btn-info" id="add-human-modal" type="button">New Person</button></div>
</div>
</div>
</div>

<div class="loan-row">

<div id="loan-fields-b">
<div class="items-column loan-column">
    <?php print drupal_render_children($form['field_bib_rel_object']); ?>
</div>
</div>
</div>

<div class="loan-row">
<div class="duration-column loan-column">
    <?php print drupal_render_children($form['field_loan_duration']); ?>
</div>
</div>

<div class="loan-row loan-row-a">
<div class="loan-columns-container">
<div class="type-column loan-column single-value-field-b">
    <?php print drupal_render_children($form['field_loan_notes']); ?>
</div>
<div class="fine-column loan-column single-value-field-b">
    <?php print drupal_render_children($form['field_loan_fine']); ?>
</div>
<div class="notes-column loan-column single-value-field-b">
    <?php print drupal_render_children($form['field_loan_other_notes']); ?>
</div>
</div>
</div>

<div class="loan-row">
<div class="loan-columns-container">
<div class="type-column loan-column single-value-field-b">
    <?php print drupal_render_children($form['field_bib_rel_type']); ?>
</div>
<div class="notes-column loan-column single-value-field-b">
    <?php print drupal_render_children($form['body']); ?>
</div>
</div>
</div>

<div class="loan-row">
<div id="edit-actions" class="form-actions form-wrapper">
   <?php print drupal_render_children($form['actions']); ?>
</div>
</div>

<div class="loan-column">
    <?php print drupal_render_children($form); ?>
</div>

<?php endif ?>
</div>