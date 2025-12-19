import { useEffect } from 'react';

/**
 * SEO Component for dynamic meta tag management
 * Updates document head with page-specific SEO data
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  product = null,
  noindex = false
}) => {
  const baseUrl = 'https://karwartech.online';
  const defaultImage = `${baseUrl}/og-image.jpg`;
  const siteName = 'Karwar Tech';

  const fullTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} - Best Mobile & Laptop Shop in Karwar`;

  const fullDescription = description ||
    'Karwar Tech is your trusted destination for new & used mobiles, laptops, desktops, and accessories in Karwar. Expert repair services with genuine parts. Best prices guaranteed!';

  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : defaultImage;

  const fullKeywords = keywords
    ? `${keywords}, Karwar Tech, mobile shop Karwar, laptop shop Karwar`
    : 'Karwar Tech, mobile shop Karwar, laptop shop Karwar, phone repair Karwar, laptop repair Karwar';

  useEffect(() => {
    // Update title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (attribute, value, content) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update primary meta tags
    updateMetaTag('name', 'description', fullDescription);
    updateMetaTag('name', 'keywords', fullKeywords);

    // Update robots
    if (noindex) {
      updateMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', fullDescription);
    updateMetaTag('property', 'og:url', fullUrl);
    updateMetaTag('property', 'og:image', fullImage);
    updateMetaTag('property', 'og:type', type);

    // Update Twitter tags
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', fullDescription);
    updateMetaTag('name', 'twitter:url', fullUrl);
    updateMetaTag('name', 'twitter:image', fullImage);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // Add Product structured data if product is provided
    if (product) {
      // Remove existing product schema
      const existingProductSchema = document.querySelector('script[data-schema="product"]');
      if (existingProductSchema) {
        existingProductSchema.remove();
      }

      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.name,
        'description': product.description || fullDescription,
        'image': product.images && product.images.length > 0
          ? product.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`)
          : [fullImage],
        'brand': {
          '@type': 'Brand',
          'name': product.brand || 'Various'
        },
        'sku': product._id || product.id,
        'offers': {
          '@type': 'Offer',
          'url': fullUrl,
          'priceCurrency': 'INR',
          'price': product.discountedPrice || product.originalPrice,
          'priceValidUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          'availability': product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': 'Karwar Tech'
          }
        },
        'aggregateRating': product.rating ? {
          '@type': 'AggregateRating',
          'ratingValue': product.rating,
          'reviewCount': product.reviewCount || 1
        } : undefined
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'product');
      script.textContent = JSON.stringify(productSchema);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Remove product schema on unmount
      const productSchema = document.querySelector('script[data-schema="product"]');
      if (productSchema) {
        productSchema.remove();
      }
    };
  }, [fullTitle, fullDescription, fullKeywords, fullUrl, fullImage, type, noindex, product]);

  return null; // This component doesn't render anything
};

export default SEO;
