{% if not modal %}
    <div class="visible-when-content-ready card px-3 mb-3 d-none d-md-block">
        {% if parent_category and parent_category.id!=0 %}
            <a href="{{ parent_category.url }}" title="{{ parent_category.name }}" class="category-back d-block{% if filter_categories %} mb-4{% endif %}">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline mr-2 svg-icon-text"} %}{{ parent_category.name }}</a>
        {% endif %}
{% endif %}
        {% if filter_categories %}
         <div class="js-accordion-container {% if modal %}filter-accordion{% endif %}">
            <div class="h6 font-big mb-0">
                <a href="#" class="js-accordion-toggle font-md-small text-uppercase row no-gutters align-items-center py-md-2">
                    <div class="col pr-3 my-1">
                        {{ "Categorías" | translate }}
                    </div>
                    <div class="col-auto my-1">
                        <span class="js-accordion-toggle-inactive">
                          {% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline svg-icon-text icon-lg font-big font-md-body mr-1"} %}
                        </span>
                        <span class="js-accordion-toggle-active" style="display: none;">
                          {% include "snipplets/svg/chevron-down.tpl" with {svg_custom_class: "icon-inline svg-icon-text icon-lg font-big font-md-body"} %}
                        </span>
                    </div>
                </a>
            </div>
            <ul class="js-accordion-content list-unstyled mt-md-1 my-3" style="display: none;"> 
                {% for category in filter_categories %}
                    <li data-item="{{ loop.index }}" class="mb-2 pb-md-1"><a href="{{ category.url }}" title="{{ category.name }}" class="btn-link font-small no-underline">{{ category.name }}</a></li>

                    {% if loop.index == 8 and filter_categories | length > 8 %}
                        <div class="js-accordion-container">
                            <div class="js-accordion-content" style="display: none;">
                    {% endif %}
                    {% if loop.last and filter_categories | length > 8 %}
                            </div>
                            <a href="#" class="js-accordion-toggle d-inline-block btn-link font-small mt-1">
                                <span class="js-accordion-toggle-inactive">{{ 'Ver más' | translate }}</span>
                                <span class="js-accordion-toggle-active" style="display: none;">{{ 'Ver menos' | translate }}</span>
                            </a>
                        </div>
                    {% endif %}
                {% endfor %}
            </ul>
        </div>
        {% endif %}
{% if not modal %}
    </div>
{% endif %}