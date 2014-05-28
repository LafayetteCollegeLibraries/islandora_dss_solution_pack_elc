<div class="loan-record">

<?php if($form): ?>

<div class="add-form-legend">

<ul>
<li><span class="add-form-legend-asterisk">*</span> = Required field</li>	
<li><span class="add-form-legend-circle">&#9702;</span> = Features autocomplete; if value not listed, please create new record</li>
</ul>

</div>

<div class="loan-row">

<div class="loan-column">
    <?php print drupal_render_children($form['field_pers_rel_subject']); ?>
</div>
<div class="loan-column">
    <?php print drupal_render_children($form['field_pers_rel_role']); ?>
</div>
<div class="loan-column">
    <?php print drupal_render_children($form['field_pers_rel_object']); ?>
</div>
</div>

<div class="loan-row">
<div class="notes-column loan-column single-value-field">
    <?php print drupal_render_children($form['body']); ?>
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
