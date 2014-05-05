<div class="human-record">

<?php if($form): ?>

<div class="human-row">

<div id="human-fields-a">
<div class="human-column">
    <?php print drupal_render_children($form['field_person_name']); ?>
</div>
<div class="human-column">
    <?php print drupal_render_children($form['field_human_middle_initials']); ?>
</div>
<div class="human-column">
    <?php print drupal_render_children($form['field_human_surname']); ?>
</div>
<div class="human-column">
    <?php print drupal_render_children($form['field_person_type']); ?>
</div>
</div>
</div>

<div class="human-row">

<div id="human-fields-b">
<div class="human-column">
    <?php print drupal_render_children($form['field_human_pers_rels']); ?>
</div>
<div class="human-column">
    <?php print drupal_render_children($form['field_person_location']); ?>
</div>
</div>
</div>

<div class="human-row human-row-a">

<div id="human-fields-c">
<div class="human-column">
    <?php print drupal_render_children($form['field_human_gender']); ?>
</div>
<div class="human-column">
    <?php print drupal_render_children($form['field_person_membership']); ?>
</div>
<div class="human-column">
    <?php print drupal_render_children($form['field_human_occupation']); ?>
</div>
</div>
</div>

<div class="human-row">

<div class="human-column human-notes-column">
    <?php print drupal_render_children($form['body']); ?>
</div>
</div>

<div class="human-row">
<div id="edit-actions" class="form-actions form-wrapper">
   <?php print drupal_render_children($form['actions']); ?>
</div>
</div>

<div class="human-row">
<div class="human-column">
    <?php print drupal_render_children($form); ?>
</div>
</div>

<?php endif ?>
</div>
