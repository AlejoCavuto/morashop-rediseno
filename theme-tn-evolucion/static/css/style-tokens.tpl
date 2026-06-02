{# /* Style tokens */ #}

:root {

  {#/*============================================================================
    #Colors
  ==============================================================================*/#}

  {#### Colors settings #}

  {# Main colors #}

  {% set main_background = settings.background_color %}
  {% set main_foreground = settings.text_color %}

  {% set accent_color = settings.accent_color %}

  {% set secondary_color = settings.secondary_color %}

  {% set button_background = settings.button_background_color %}
  {% set button_foreground = settings.button_foreground_color %}
  
  {% set label_background = settings.label_background_color %}
  {% set label_foreground = settings.label_foreground_color %}

  {# Optional colors #}

  {% set adbar_background = settings.adbar_colors ? settings.adbar_background_color : main_background %}
  {% set adbar_foreground = settings.adbar_colors ? settings.adbar_foreground_color : main_foreground %}

  {% set header_background = settings.header_colors ? settings.header_background_color : main_background %}
  {% set header_foreground = settings.header_colors ? settings.header_foreground_color : main_foreground %}
  {% set header_badge_background = settings.header_colors ? settings.header_badge_background_color : main_background %}
  {% set header_badge_foreground = settings.header_colors ? settings.header_badge_foreground_color : main_foreground %}

  {% if settings.desktop_nav_colors %}
    {% set nav_desktop_background = settings.desktop_nav_background_color %}
    {% set nav_desktop_foreground = settings.desktop_nav_foreground_color %}
  {% else %}
    {% set nav_desktop_background = settings.header_colors ? settings.header_background_color : main_background %}
    {% set nav_desktop_foreground = settings.header_colors ? settings.header_foreground_color : main_foreground %}
  {% endif %}

  {% set footer_background = settings.footer_colors ? settings.footer_background_color : main_background %}
  {% set footer_foreground = settings.footer_colors ? settings.footer_foreground_color : main_foreground %}

  {% set brands_background = settings.brands_colors ? settings.brands_background_color : '' %}
  {% set brands_foreground = settings.brands_colors ? settings.brands_foreground_color : '' %}

  {% set featured_products_background = settings.featured_product_background_color %}
  {% set featured_products_foreground = settings.featured_product_foreground_color %}

  {% set new_products_background = settings.new_product_background_color %}
  {% set new_products_foreground = settings.new_product_foreground_color %}

  {% set sale_products_background = settings.sale_product_background_color %}
  {% set sale_products_foreground = settings.sale_product_foreground_color %}

  {% set promotion_products_background = settings.promotion_product_background_color %}
  {% set promotion_products_foreground = settings.promotion_product_foreground_color %}

  {% set best_seller_products_background = settings.best_seller_product_background_color %}
  {% set best_seller_products_foreground = settings.best_seller_product_foreground_color  %}

  {% set newsletter_background = settings.home_news_colors ? settings.home_news_background_color : '' %}
  {% set newsletter_foreground = settings.home_news_colors ? settings.home_news_foreground_color : '' %}

  {% set welcome_background = settings.welcome_background_color %}
  {% set welcome_foreground = settings.welcome_foreground_color %}

  {% set institutional_background = settings.institutional_background_color %}
  {% set institutional_foreground = settings.institutional_foreground_color %}

  {#### CSS Colors #}

  {# Main colors #}

  --main-foreground: {{ main_foreground }};
  --main-background: {{ main_background }};

  --accent-color: {{ accent_color }};
  --secondary-color: {{ secondary_color }};

  --button-background: {{ button_background }};
  --button-foreground: {{ button_foreground }};

  --label-background: {{ label_background }};
  --label-foreground: {{ label_foreground }};

  {# Optional colors #}

  --adbar-background: {{ adbar_background }};
  --adbar-foreground: {{ adbar_foreground }};

  --header-background: {{ header_background }};
  --header-foreground: {{ header_foreground }};
  --header-badge-background: {{ header_badge_background }};
  --header-badge-foreground: {{ header_badge_foreground }};

  --nav-desktop-background: {{ nav_desktop_background }};
  --nav-desktop-foreground: {{ nav_desktop_foreground }};

  --footer-background: {{ footer_background }};
  --footer-foreground: {{ footer_foreground }};

  --brands-background: {{ brands_background }};
  --brands-foreground: {{ brands_foreground }};

  --featured-background: {{ featured_products_background }};
  --featured-foreground: {{ featured_products_foreground }};

  --new-background: {{ new_products_background }};
  --new-foreground: {{ new_products_foreground }};

  --sale-background: {{ sale_products_background }};
  --sale-foreground: {{ sale_products_foreground }};

  --promotion-background: {{ promotion_products_background }};
  --promotion-foreground: {{ promotion_products_foreground }};

  --best-seller-background: {{ best_seller_products_background }};
  --best-seller-foreground: {{ best_seller_products_foreground }};

  --newsletter-background: {{ newsletter_background }};
  --newsletter-foreground: {{ newsletter_foreground }};

  --welcome-background: {{ welcome_background }};
  --welcome-foreground: {{ welcome_foreground }};

  --institutional-background: {{ institutional_background }};
  --institutional-foreground: {{ institutional_foreground }};

  {# Color shades #}

  {# Opacity hex levels #}

  {% set opacity_05 = '0D' %}
  {% set opacity_08 = '14' %}
  {% set opacity_10 = '1A' %}
  {% set opacity_20 = '33' %}
  {% set opacity_30 = '4D' %}
  {% set opacity_40 = '66' %}
  {% set opacity_50 = '80' %}
  {% set opacity_60 = '99' %}
  {% set opacity_80 = 'CC' %}
  {% set opacity_90 = 'E6' %}

  --main-foreground-opacity-05: {{ main_foreground }}{{ opacity_05 }};
  --main-foreground-opacity-08: {{ main_foreground }}{{ opacity_08 }};
  --main-foreground-opacity-10: {{ main_foreground }}{{ opacity_10 }};
  --main-foreground-opacity-20: {{ main_foreground }}{{ opacity_20 }};
  --main-foreground-opacity-30: {{ main_foreground }}{{ opacity_30 }};
  --main-foreground-opacity-40: {{ main_foreground }}{{ opacity_40 }};
  --main-foreground-opacity-50: {{ main_foreground }}{{ opacity_50 }};
  --main-foreground-opacity-60: {{ main_foreground }}{{ opacity_60 }};

  --main-background-opacity-30: {{ main_background }}{{ opacity_30 }};
  --main-background-opacity-40: {{ main_background }}{{ opacity_40 }};
  --main-background-opacity-50: {{ main_background }}{{ opacity_50 }};
  --main-background-opacity-80: {{ main_background }}{{ opacity_80 }};
  --main-background-opacity-90: {{ main_background }}{{ opacity_90 }};

  --header-foreground-opacity-10: {{ header_foreground }}{{ opacity_10 }};

  --nav-desktop-foreground-opacity-08: {{ nav_desktop_foreground }}{{ opacity_08 }};
  --nav-desktop-foreground-opacity-10: {{ nav_desktop_foreground }}{{ opacity_10 }};
  --nav-desktop-foreground-opacity-20: {{ nav_desktop_foreground }}{{ opacity_20 }};

  --brands-foreground-opacity-10: {{ brands_foreground }}{{ opacity_10 }};

  --welcome-foreground-opacity-90: {{ welcome_foreground }}{{ opacity_90 }};

  --institutional-foreground-opacity-90: {{ institutional_foreground }}{{ opacity_90 }};

  --news-foreground-opacity-30: {{ newsletter_foreground }}{{ opacity_30 }};
  --news-foreground-opacity-50: {{ newsletter_foreground }}{{ opacity_50 }};

  --footer-foreground-opacity-10: {{ footer_foreground }}{{ opacity_10 }};
  --footer-foreground-opacity-20: {{ footer_foreground }}{{ opacity_20 }};
  --footer-foreground-opacity-50: {{ footer_foreground }}{{ opacity_50 }};
  --footer-foreground-opacity-60: {{ footer_foreground }}{{ opacity_60 }};
  --footer-foreground-opacity-80: {{ footer_foreground }}{{ opacity_80 }};

  {# Alert colors CSS #}

  --success: #4bb98c;
  --danger: #dd7774;
  --warning: #dc8f38;
  --info: #3d9ccc;

  {#/*============================================================================
    #Fonts
  ==============================================================================*/#}

  {# Font families #}

  --heading-font: {{ settings.font_headings | raw }};
  --body-font: {{ settings.font_rest | raw }};

  {# Font sizes #}

  {% set heading_size = settings.headings_size %}

  --h1: {{ heading_size }}px;
  --h1-huge: {{ heading_size + 2 }}px;
  --h1-huge-md: {{ heading_size + 12 }}px;
  --h2: {{ heading_size - 4 }}px;
  --h3: {{ heading_size - 8 }}px;
  --h4: {{ heading_size - 10 }}px;
  --h5: {{ heading_size - 12 }}px;
  --h6: {{ heading_size - 14 }}px;
  --h6-small: {{ heading_size - 16 }}px;
 
  {% set font_rest_size = settings.font_rest_size %}

  --font-huge: {{ font_rest_size + 10 }}px;
  --font-largest: {{ font_rest_size + 6 }}px;
  --font-large: {{ font_rest_size + 4 }}px;
  --font-big: {{ font_rest_size + 2 }}px;
  --font-base: {{ font_rest_size }}px;
  --font-small: {{ font_rest_size - 2 }}px;
  --font-smallest: {{ font_rest_size - 4 }}px;

  {# Titles weight #}

  {% set title_weight = settings.headings_bold ? '700' : '400' %}

  --title-font-weight: {{ title_weight }};

  {#/*============================================================================
    #Spacing
  ==============================================================================*/#}

  {# Gutters #}

  --gutter: 15px;
  --guter-container: 15px;
  --guter-container-md: 40px;
  --gutter-negative: calc(var(--gutter) * -1);
  --gutter-half: calc(var(--gutter) / 2);
  --gutter-half-negative: calc(var(--gutter) * -1 / 2);
  --gutter-double: calc(var(--gutter) * 2);

  {#/*============================================================================
    #Misc
  ==============================================================================*/#}

  {# Borders #}

  --border-radius: 4px;
  --border-radius-half: calc(var(--border-radius) / 2);
  --border-radius-quarter: calc(var(--border-radius) / 4);
  --border-solid: 1px solid;
  --border-dashed: 1px dashed;

  {# Shadows #}

  --shadow-distance: 0 0 5px;

}