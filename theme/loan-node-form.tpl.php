
<div class="loan-record">
<?php if($form): ?>
<div class="loan-row">

<div id="loan-fields-a">
<div class="filename-column loan-column single-value-field">
    <?php print drupal_render_children($form['field_loan_filename']); ?>
</div>
<div class="shareholder-column loan-column single-value-field">
    <?php print drupal_render_children($form['field_loan_shareholder']); ?>
</div>
<div class="patron-column loan-column single-value-field">
    <?php print drupal_render_children($form['field_bib_rel_subject']); ?>
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

<div class="loaned-item-elements">


<div class="duration-column loan-column">
    <?php print drupal_render_children($form['field_loan_duration']); ?>
</div>


<legend class="loaned-fieldset">
<span class="fieldset-legend borrowed-volumes-legend">Borrowed Volumes </span>
</legend>

<div id="borrowed-volumes">
<div class="issues-column loan-column">
    <?php print drupal_render_children($form['field_loan_issues_loaned']); ?>
</div>

<div class="volumes-column loan-column">
    <?php print drupal_render_children($form['field_loan_volumes_loaned']); ?>
</div>

<div class="months-column loan-column">
    <?php print drupal_render_children($form['field_loan_months_loaned']); ?>
</div>

<div class="years-column loan-column">
    <?php print drupal_render_children($form['field_loan_years_loaned']); ?>
</div>
</div>
</div>
</div>

<div class="loan-row loan-row-a">


<div class="loan-columns-container">
<div class="fine-column loan-column single-value-field-b">
    <?php print drupal_render_children($form['field_loan_fine']); ?>
</div>
<div class="type-column loan-column single-value-field-b">
    <?php print drupal_render_children($form['field_bib_rel_type']); ?>
</div>

<div class="ledger-column loan-column single-value-field-b">
    <?php
   print drupal_render_children($form['field_loan_ledger']);
   ?>
</div>

<div class="ledger-column loan-column">
    <?php
   print drupal_render_children($form['field_was_ordered']);
   ?>
</div>

<div class="notes-column loan-column single-value-field-b">
    <?php print drupal_render_children($form['body']); ?>
</div>
</div>
</div>

<div class="loan-row">
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