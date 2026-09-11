const WORDPRESS_API_URL = import.meta.env.WORDPRESS_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2';

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media?: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

// ACF Interfaces for Homepage
export interface ACFImage {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface HomePageACF {
  hero_background_image_1?: ACFImage | number | string;
  hero_background_image_2?: ACFImage | number | string;
  hero_background_image_3?: ACFImage | number | string;
  hero_subtitle?: string;
  hero_title_line_1?: string;
  hero_title_line1?: string;
  hero_title_line2?: string;
  hero_title_line3?: string;
  hero_title_line4?: string;
  hero_button_text?: string;
  product_card_1_category?: string;
  product_card_1_title?: string;
  product_card_2_category?: string;
  product_card_2_title?: string;
  product_card_3_category?: string;
  product_card_3_title?: string;

  section2_title_cn?: string;
  section2_title_en?: string;
  section2_application_1_bg_image?: string;
  section2_application_1_icon?: string;
  section2_application_1_title_cn?: string;
  section2_application_1_title_en?: string;
  section2_application_1_link?: string;
  section2_application_2_bg_image?: string;
  section2_application_2_icon?: string;
  section2_application_2_title_cn?: string;
  section2_application_2_title_en?: string;
  section2_application_2_link?: string;
  section2_application_3_bg_image?: string;
  section2_application_3_icon?: string;
  section2_application_3_title_cn?: string;
  section2_application_3_title_en?: string;
  section2_application_3_link?: string;
  section2_application_4_bg_image?: string;
  section2_application_4_icon?: string;
  section2_application_4_title_cn?: string;
  section2_application_4_title_en?: string;
  section2_application_4_link?: string;
  section2_application_5_bg_image?: string;
  section2_application_5_icon?: string;
  section2_application_5_title_cn?: string;
  section2_application_5_title_en?: string;
  section2_application_5_link?: string;
  section2_application_6_bg_image?: string;
  section2_application_6_icon?: string;
  section2_application_6_title_cn?: string;
  section2_application_6_title_en?: string;
  section2_application_6_link?: string;
  section2_footer_left?: string;
  section2_footer_right?: string;

  // Section 3 - Company Information (Part 1)
  section3_tab_1_icon?: string;
  section3_tab_1_title?: string;
  section3_tab_2_icon?: string;
  section3_tab_2_title?: string;
  section3_tab_3_icon?: string;
  section3_tab_3_title?: string;
  section3_panel_1_video?: string;
  section3_panel_1_poster?: ACFImage | number | string;
  section3_panel_1_title?: string;
  section3_panel_1_content?: string;
  section3_panel_1_button_text?: string;
  section3_panel_1_button_link?: string;

  // Section 4 - Manifesto
  section4_background_image?: ACFImage | number | string;
  section4_gallery_images?: string[] | number[];
}

export interface WordPressPageWithACF extends WPPage {
  acf: HomePageACF;
}

async function fetchAPI(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${WORDPRESS_API_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getPosts(perPage: number = 10): Promise<WPPost[]> {
  return fetchAPI('/posts', {
    _embed: 'wp:featuredmedia',
    per_page: perPage.toString(),
  });
}

export async function getPostBySlug(slug: string): Promise<WPPost> {
  const posts = await fetchAPI('/posts', {
    slug,
    _embed: 'wp:featuredmedia',
  });
  return posts[0];
}

export async function getPages(): Promise<WPPage[]> {
  return fetchAPI('/pages');
}

export async function getPageBySlug(slug: string): Promise<WPPage> {
  const pages = await fetchAPI('/pages', { slug });
  return pages[0];
}

export async function getHomePage(): Promise<WordPressPageWithACF | null> {
  try {
    console.log('Fetching homepage from WordPress API...');
    const startTime = Date.now();

    const data = await fetchAPI('/pages/45308');

    if (!data.acf) {
      console.warn('Warning: No ACF data found in WordPress response');
      return data;
    }

    console.log('ACF data loaded successfully');

    // 收集所有需要转换的图片 ID
    const imageFieldsToFetch: Array<{ field: string; id: number }> = [];

    // 检查所有可能是 ID 的图片字段
    const allImageFields = [
      'hero_background_image_1',
      'hero_background_image_2',
      'hero_background_image_3',
      'section2_application_1_bg_image',
      'section2_application_1_icon',
      'section2_application_2_bg_image',
      'section2_application_2_icon',
      'section2_application_3_bg_image',
      'section2_application_3_icon',
      'section2_application_4_bg_image',
      'section2_application_4_icon',
      'section2_application_5_bg_image',
      'section2_application_5_icon',
      'section2_application_6_bg_image',
      'section2_application_6_icon',
      'section3_panel_1_poster',
      'section4_background_image',
    ];

    for (const field of allImageFields) {
      const value = data.acf[field];
      if (typeof value === 'number' && value > 0) {
        imageFieldsToFetch.push({ field, id: value });
      }
    }

    // 处理 gallery images
    const galleryImageIds: number[] = [];
    if (data.acf.section4_gallery_images && Array.isArray(data.acf.section4_gallery_images)) {
      const galleryIds = data.acf.section4_gallery_images;
      if (galleryIds.length > 0 && typeof galleryIds[0] === 'number') {
        galleryImageIds.push(...galleryIds);
      }
    }

    // 如果没有需要获取的图片，直接返回
    if (imageFieldsToFetch.length === 0 && galleryImageIds.length === 0) {
      console.log('✅ All images are already URLs, no additional requests needed');
      const endTime = Date.now();
      console.log(`⏱️ Total time: ${endTime - startTime}ms`);
      return data;
    }

    console.log(`📦 Fetching ${imageFieldsToFetch.length + galleryImageIds.length} images in parallel...`);

    // 并行获取所有图片
    const allImagePromises = [
      // 单个图片字段
      ...imageFieldsToFetch.map(async ({ field, id }) => {
        try {
          const media = await fetchAPI(`/media/${id}`);

          // Hero section 返回对象，其他返回 URL
          if (field.startsWith('hero_background')) {
            return {
              field,
              value: {
                id,
                url: media.source_url,
                alt: media.alt_text || '',
                width: media.media_details?.width || 0,
                height: media.media_details?.height || 0,
              },
            };
          } else {
            return { field, value: media.source_url };
          }
        } catch (error) {
          console.error(`❌ Failed to load image ${id} for ${field}:`, error);
          return { field, value: null };
        }
      }),

      // Gallery images
      ...galleryImageIds.map(async (id) => {
        try {
          const media = await fetchAPI(`/media/${id}`);
          return { type: 'gallery', value: media.source_url };
        } catch (error) {
          console.error(`❌ Failed to load gallery image ${id}:`, error);
          return { type: 'gallery', value: null };
        }
      }),
    ];

    const results = await Promise.all(allImagePromises);

    // 应用结果
    const galleryUrls: string[] = [];
    for (const result of results) {
      if ('type' in result && result.type === 'gallery') {
        if (result.value) galleryUrls.push(result.value);
      } else if ('field' in result && result.value) {
        data.acf[result.field] = result.value;
      }
    }

    if (galleryUrls.length > 0) {
      data.acf.section4_gallery_images = galleryUrls;
    }

    const endTime = Date.now();
    console.log(`✅ All images processed in parallel`);
    console.log(`⏱️ Total time: ${endTime - startTime}ms`);

    return data;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}
