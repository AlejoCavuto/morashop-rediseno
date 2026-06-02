{% set input_class = search_modal ? 'background-secondary' : '' %}
{% set btn_class = search_modal ? 'mr-2' : '' %}
{% set suggestions_container_class = search_modal ? '' : 'card mt-md-1 mt-2' %}

{% if search_modal %}
    <a href="#" class="js-modal-close js-fullscreen-modal-close search-btn search-close-btn">
        {% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg svg-icon-text"} %}
    </a>
{% endif %}

{{ component('search/search-form', {form_classes: { input_group: 'm-0', input: input_class, submit: btn_class, delete_content: btn_class, search_suggestions_container: suggestions_container_class}}) }}