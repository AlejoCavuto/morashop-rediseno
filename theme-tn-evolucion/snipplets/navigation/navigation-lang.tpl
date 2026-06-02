{% if header %}
    <ul class="list list-unstyled font-small">
        {% for language in languages | escape %}
            <li class="{% if not loop.last %}mb-3{% endif %}{% if language.active %} font-weight-bold{% endif %}">
                <a class="d-inline-flex align-items-center" href="{{ language.url }}">
                    <img class="lazyload mr-2" src="{{ 'images/empty-placeholder.png' | static_url }}" data-src="{{ language.country | flag_url }}" alt="{{ language.name }}" />
                    {{ language.country_name }}
                </a>
            </li>
        {% endfor %}
    </ul>
{% else %}
    {% embed "snipplets/forms/form-select.tpl" with{select_label: false, select_custom_class: "js-lang-select", select_group_custom_class: "mb-0 d-inline-block w-auto align-middle", select_small: true} %}
        {% block select_options %}
            {% for language in languages %}
                <option value="{{ language.country }}" data-country-url="{{ language.url }}" {% if language.active %}selected{% endif %}>{{ language.country_name }}</option>
            {% endfor %}
        {% endblock select_options%}
    {% endembed %}
{% endif %}
