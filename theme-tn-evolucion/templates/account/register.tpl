{% embed "snipplets/page-header.tpl" %}
	{% block page_header_text %}{{ 'Crear cuenta' | translate }}{% endblock page_header_text %}
{% endembed %}

<section class="account-page mb-4">
	<div class="container">
		<div class="row">
			<div class="col-md-5">
				<h2 class="font-body mb-4">{{ 'Comprá más rápido y llevá el control de tus pedidos, ¡en un solo lugar!'| translate }}</h2>

				{% if account_validation == 'pending' %}
					{# Account Validation #}
					<div class="js-account-validation-pending alert text-center p-3">
						{% include "snipplets/svg/email.tpl" with {svg_custom_class: "icon-inline icon-2x svg-icon-text"} %}
						<h5 class="my-3">{{ "¡Estás a un paso de crear tu cuenta!" | translate }}</h5>
						<p class="m-0 font-small">{{ "Te enviamos un link a <strong>{1}</strong> para que valides tu email." | t(customer_email) }} </p>
					</div>
					<div class="mb-3 font-small">
						<p class="m-0">{{ "¿Todavía no lo recibiste?" | translate }} <span class="js-resend-validation-link btn-link ml-1">{{ "Enviar link de nuevo" | translate }}</span></p>
					</div>
					<div class="js-resend-validation-success alert alert-success" style="display:none">
						<span class="m-1">{{ "¡El link fue enviado correctamente!" | translate }}</span>
					</div>
					<div class="js-resend-validation-error alert alert-danger" style="display:none">
						<span class="m-1">{{ "No pudimos enviar el email, intentalo de nuevo en unos minutos." | translate }}</span>
					</div>
					
				{% else %}

					{# Register Form #}

					{% embed "snipplets/forms/form.tpl" with{form_id: 'login-form', submit_custom_class: 'js-recaptcha-button btn-block', submit_prop: 'disabled', submit_text: 'Crear cuenta' | translate, data_store: 'account-register' } %}
						{% block form_body %}

							{# Name input #}
							
							{% embed "snipplets/forms/form-input.tpl" with{type_text: true, input_for: 'name', input_value: result.name, input_name: 'name', input_id: 'name', input_label_text: 'Nombre y apellido' | translate, input_placeholder: 'ej.: María Perez' | translate} %}
								{% block input_form_alert %}
									{% if result.errors.name %}
										<div class="notification-danger notification-left">{{ 'Usamos tu nombre para identificar tus pedidos.' | translate }}</div>
									{% endif %}
								{% endblock input_form_alert %}
							{% endembed %}

							{# Email input #}

							{% embed "snipplets/forms/form-input.tpl" with{type_email: true, input_for: 'email', input_value: result.email, input_name: 'email', input_id: 'email', input_label_text: 'Email' | translate, input_placeholder: 'ej.: tunombre@email.com' | translate} %}
								{% block input_form_alert %}
									{% if result.errors.email == 'exists' %}
										<div class="notification-danger notification-left">{{ 'Encontramos otra cuenta que ya usa este email. Intentá usando otro o iniciá sesión.' | translate }}</div>
									{% elseif result.errors.email %}
										<div class="notification-danger notification-left">{{ 'Necesitamos un email válido para crear tu cuenta.' | translate }}</div>
									{% endif %}
								{% endblock input_form_alert %}
							{% endembed %}

							{# Phone input #}

							{% embed "snipplets/forms/form-input.tpl" with{type_tel: true, input_for: 'phone', input_value: result.phone, input_name: 'phone', input_id: 'phone', input_label_text: 'Teléfono (opcional)' | translate, input_placeholder: 'ej.: 1123445567' | translate} %}
							{% endembed %}

							{# Password input #}

							{% embed "snipplets/forms/form-input.tpl" with{type_password: true, input_for: 'password', input_name: 'password', input_id: 'password', input_label_text: 'Contraseña' | translate, input_placeholder: 'ej.: tucontraseña' | translate} %}
								{% block input_form_alert %}
									{% if result.errors.password == 'required' %}
										<div class="notification-danger notification-left">{{ 'Necesitamos una contraseña para registrarte.' | translate }}</div>
									{% endif %}
								{% endblock input_form_alert %}
							{% endembed %}

							{# Password confirm input #}

							{% embed "snipplets/forms/form-input.tpl" with{type_password: true, input_for: 'password_confirmation', input_name: 'password_confirmation', input_id: 'password_confirmation', input_label_text: 'Confirmar contraseña' | translate, input_placeholder: 'ej.: tucontraseña' | translate} %}
								{% block input_form_alert %}
									{% if result.errors.password == 'confirmation' %}
										<div class="notification-danger notification-left">{{ 'Las contraseñas no coinciden.' | translate }}</div>
									{% endif %}
								{% endblock input_form_alert %}
							{% endembed %}

							{# Google reCAPTCHA #}

							<div class="g-recaptcha" data-sitekey="{{recaptchaSiteKey}}" data-callback="recaptchaCallback"></div>
							
						{% endblock %}
					{% endembed %}
				{% endif %}
				<p class="{% if account_validation == 'pending' %}text-left m-0{% else %}my-2 text-center{% endif %}">{{ '¿Ya tenés una cuenta?' | translate }} {{ "Iniciá sesión" | translate | a_tag(store.customer_login_url, '', 'btn-link ml-1') }}</p>
			</div>
		</div>
	</div>
</section>
