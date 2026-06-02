{% set newsletter_contact_error = contact.type == 'newsletter' and not contact.success %}

{% if settings.news_show %}
    <div class="js-newsletter newsletter pb-3 overflow-none">
        {% if settings.news_title %}
            <div class="font-small text-uppercase font-weight-bold py-3">{{ settings.news_title }}</div>
        {% endif %}
        <form method="post" action="/winnie-pooh" onsubmit="this.setAttribute('action', '');" data-store="newsletter-form">
            <div class="newsletter-form input-append row no-gutters">
                <div class="col">
                    {% embed "snipplets/forms/form-input.tpl" with{input_for: 'email', type_email: true, input_name: 'email', input_id: 'email', input_placeholder: 'Ingresá tu email...' | translate, input_group_custom_class: "mb-0", input_custom_class: '', input_aria_label: 'Email' | translate } %}
                    {% endembed %}
                </div>
                <div class="col-auto pl-2">
                    <div class="winnie-pooh" style="display: none;">
                        <label for="winnie-pooh-newsletter">{{ "No completar este campo" | translate }}</label>
                        <input id="winnie-pooh-newsletter" type="text" name="winnie-pooh"/>
                    </div>
                    <input type="hidden" name="name" value="{{ "Sin nombre" | translate }}" />
                    <input type="hidden" name="message" value="{{ "Pedido de inscripción a newsletter" | translate }}" />
                    <input type="hidden" name="type" value="newsletter" />
                    <input type="submit" name="contact" class="btn btn-primary" value="{{ "Enviar" | translate }}" />
                </div>
            </div>
        </form>
        {% if contact and contact.type == 'newsletter' %}
            {% if contact.success %}
                <div class="alert alert-success mt-2">{{ "¡Gracias por suscribirte! A partir de ahora vas a recibir nuestras novedades en tu email" | translate }}</div>
            {% else %}
                <div class="alert alert-danger mt-2">{{ "Necesitamos tu email para enviarte nuestras novedades." | translate }}</div>
            {% endif %}
        {% endif %}
    </div>
{% endif %}