{% if store.whatsapp %}
    <a href="{{ store.whatsapp }}" target="_blank" class="{% if header %}btn btn-utility{% else %}js-btn-fixed-bottom btn-whatsapp{% endif %}" aria-label="{{ 'Comunicate por WhatsApp' | translate }}">
        {% set whatsapp_icon_url = header ? '-line' : '' %}
        {% set whatsapp_icon_classes = header ? 'icon-inline utilities-icon' : '' %}

        {% include "snipplets/svg/whatsapp" ~ whatsapp_icon_url ~ ".tpl" with {svg_custom_class: whatsapp_icon_classes} %}
    </a>
{% endif %}
