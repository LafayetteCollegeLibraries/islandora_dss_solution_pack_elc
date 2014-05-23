<div class="loan-record">
<?php if($form): ?>

<div class="add-form-legend">

<ul>
<li><span class="add-form-legend-asterisk">*</span> = Required field</li>	
<li><span class="add-form-legend-circle">&#9702;</span> = Features autocomplete; if value not listed, please create new record</li>
</ul>

</div>

<div class="loan-subset-selection">

<button id="edit-loan-subset-1-3" class="btn form-submit active" type="button" value="Ledger 1-3" name="op" >Ledger 1-3</button>
<button id="edit-loan-subset-4-5" class="btn form-submit" type="button" value="Ledger 4-5" name="op" >Ledger 4-5</button>
</div>

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
  <!-- @todo Migrate this into the $form field field_loan_shareholder -->
  <div class="node-add-shareholder form-item"><button class="add-node-modal btn btn-info" id="add-human-modal" type="button" data-content-type="human" data-node-type="" data-input="#edit-field-loan-shareholder-und">Create New Person</button></div>
</div>
</div>
</div>

<div class="loan-row">

<div id="loan-fields-b">
<div class="items-column loan-column">
    <?php print drupal_render_children($form['field_bib_rel_object']); ?>
    <?php print drupal_render_children($form['field_loan_volumes_text']); ?>
    <?php print drupal_render_children($form['field_loan_issues_text']); ?>
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