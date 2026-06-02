{% embed "snipplets/page-header.tpl" %}
	{% block page_header_text %}{{ 'Iniciar sesión' | translate }}{% endblock page_header_text %}
{% endembed %}

{# Login Form #}

<section class="account-page mb-4">
	<div class="container">
		<div class="row">
			<div class="col-md-5">
				{# Account Validation #}

				{% if account_validation == 'success' %}
					<div class="js-account-validation-success alert alert-success">
						<p class="mt-2">{{ "¡Tu cuenta fue creada con éxito!" | translate }}</p>
					</div>
				{% elseif account_validation == 'expired' %}
					<div class="js-account-validation-expired alert alert-danger">
						<p class="my-2">{{ "Tu link de validación expiró." | translate }}</p>
					</div>
					<div class="text-center mb-4 font-small">
						<span class="js-resend-validation-link btn-link">{{ "Enviar link de nuevo >" | translate }}</span>
					</div>
				{% elseif account_validation == 'pending' %}
					<div class="js-account-validation-pending alert alert-danger">
						<p class="my-2">{{ "Validá tu email usando el link que te enviamos a <strong>{1}</strong> cuando creaste tu cuenta." | t(customer_email) }}</p>
					</div>
					<div class="text-center font-small">
						<p>{{ "¿No lo encontraste?" | translate }} <span class="js-resend-validation-link btn-link">{{ "Enviar link de nuevo" | translate }}</span></p>
					</div>
				{% endif %}
				<div class="js-resend-validation-success alert alert-success" style="display:none">
					<p class="m-1">{{ "¡El link fue enviado correctamente!" | translate }}</p>
				</div>
				<div class="js-resend-validation-error alert alert-danger" style="display:none">
					<p class="m-1">{{ "No pudimos enviar el email, intentalo de nuevo en unos minutos." | translate }}</p>
				</div>
				<div class="js-too-many-attempts alert alert-danger" style="display:none">
					<p class="m-1">
						{{ 'Superaste la cantidad de intentos permitidos. <br> Volvé a probar en' | translate }}
						<span class="js-too-many-attempts-countdown"></span>
					</p>
				</div>

				{% embed "snipplets/forms/form.tpl" with{form_id: 'login-form', submit_custom_class: 'btn-block', submit_text: 'Iniciar sesión' | translate, data_store: 'account-login' } %}
					{% block form_body %}

						{# Name input #}

						{% embed "snipplets/forms/form-input.tpl" with{input_for: 'email', type_email: true, input_value: result.email, input_name: 'email', input_custom_class: 'js-account-input', input_label_text: 'Email' | translate, input_required: true, input_placeholder: 'ej.: tuemail@email.com' | translate } %}
						{% endembed %}

						{# Password input #}

						{% embed "snipplets/forms/form-input.tpl" with{input_for: 'password', type_password: true, input_name: 'password', input_custom_class: 'js-account-input', input_help: true, input_help_link: store.customer_reset_password_url, input_link_class: 'btn-link btn-link font-small float-right mb-4 mr-3', input_label_text: 'Contraseña' | translate, input_required: true, input_placeholder: 'ej.: tucontraseña' | translate } %}

						{% block input_help_text %}{{ '¿Olvidaste tu contraseña?' | translate }}{% endblock input_help_text %}

						{% endembed %}
					
					{% if result.invalid %}
				   		 <div class="alert alert-danger">{{ 'Estos datos no son correctos. ¿Chequeaste que estén bien escritos?' | translate }}</div>
					{% endif %}

					{% endblock %}
				{% endembed %}
				{% if 'mandatory' not in store.customer_accounts %}
					<p class="my-2 text-center"> {{ "¿No tenés cuenta aún?" | translate }} {{ "Crear cuenta" | translate | a_tag(store.customer_register_url, '', 'btn-link btn-link font-small mb-2 mr-3') }}</p>
				{% endif %}
			</div>
		</div>
	</div>
</section>