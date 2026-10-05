// Seed content extracted from "Huu Tin - Company profile 2026.pdf".
// English copy is taken verbatim from the PDF; Vietnamese is a translation of it.
// Images are referenced by their path inside /seed-assets (without extension).

type L<T = string> = { en: T; vi: T }

export type SeedCategory = { slug: string; order: number; title: L }

export const categories: SeedCategory[] = [
  { slug: 'branding-design', order: 1, title: { en: 'Branding & Design', vi: 'Thương hiệu & Thiết kế' } },
  { slug: 'marketing-campaigns', order: 2, title: { en: 'Marketing Campaigns', vi: 'Chiến dịch marketing' } },
  { slug: 'video-production', order: 3, title: { en: 'Video Production', vi: 'Sản xuất video' } },
  { slug: 'events-publishing', order: 4, title: { en: 'Events & Publishing', vi: 'Sự kiện & Xuất bản' } },
]

export type SeedProject = {
  slug: string
  order: number
  category: string
  year?: string
  featured?: boolean
  cover: string
  gallery: string[]
  logo?: string
  videoUrl?: string
  externalUrl?: string
  title: L
  subtitle?: L
  excerpt: L
  body?: L<string[]>
  quote?: L
}

const range = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}-${String(from + i).padStart(2, '0')}`)

export const projects: SeedProject[] = [
  {
    slug: 'vleague-rebranding',
    order: 1,
    category: 'branding-design',
    featured: true,
    cover: 'projects/vleague-rebrand-01',
    gallery: range('projects/vleague-rebrand', 2, 13),
    videoUrl: 'https://www.youtube.com/watch?v=kjk0zL3xbSc',
    title: { en: 'Rebranding V.League', vi: 'Tái định vị thương hiệu V.League' },
    subtitle: {
      en: 'Vietnam Professional Football Leagues',
      vi: 'Hệ thống giải bóng đá chuyên nghiệp Việt Nam',
    },
    excerpt: {
      en: 'A comprehensive rebranding of V.League 1, V.League 2 and the National Cup — bold, modern and distinctly Vietnamese.',
      vi: 'Tái định vị toàn diện V.League 1, V.League 2 và Cúp Quốc gia — táo bạo, hiện đại và mang đậm bản sắc Việt.',
    },
    body: {
      en: [
        'A comprehensive rebranding of Vietnam’s professional football league system including V.League 1, V.League 2 and the National Cup, created to express a bold, modern and distinctly Vietnamese identity.',
        'Guided by the new slogan **“World Game, Our Festival”**, the brand celebrates football as both a global sport and a national festival that unites communities, inspires pride and drives Vietnamese football forward.',
      ],
      vi: [
        'Dự án tái định vị toàn diện hệ thống giải bóng đá chuyên nghiệp Việt Nam, bao gồm V.League 1, V.League 2 và Cúp Quốc gia, nhằm thể hiện một bản sắc táo bạo, hiện đại và mang đậm chất Việt.',
        'Với khẩu hiệu mới **“World Game, Our Festival”**, thương hiệu tôn vinh bóng đá vừa là môn thể thao toàn cầu, vừa là ngày hội của cả dân tộc — gắn kết cộng đồng, khơi dậy niềm tự hào và đưa bóng đá Việt Nam tiến về phía trước.',
      ],
    },
    quote: { en: 'World Game, Our Festival', vi: 'World Game, Our Festival' },
  },
  {
    slug: 'vpf-rebranding',
    order: 2,
    category: 'branding-design',
    featured: true,
    cover: 'projects/vpf-rebrand-01',
    gallery: range('projects/vpf-rebrand', 2, 6),
    title: { en: 'Rebranding VPF', vi: 'Tái định vị thương hiệu VPF' },
    subtitle: {
      en: 'Vietnam Professional Football Company (VPF)',
      vi: 'Công ty Cổ phần Bóng đá Chuyên nghiệp Việt Nam (VPF)',
    },
    excerpt: {
      en: 'A new visual identity for the Vietnam Professional Football Company, the organiser of Vietnam’s professional leagues.',
      vi: 'Bộ nhận diện mới cho Công ty Cổ phần Bóng đá Chuyên nghiệp Việt Nam — đơn vị tổ chức các giải chuyên nghiệp.',
    },
  },
  {
    slug: 'watch-world-cup-on-vtvgo',
    order: 3,
    category: 'marketing-campaigns',
    featured: true,
    year: '2026',
    cover: 'projects/vtvgo-campaign-01',
    gallery: range('projects/vtvgo-campaign', 2, 5),
    externalUrl: 'https://vtv.vn/cung-dinh-bac-khoi-dong-fifa-world-cup-2026-tren-vtvgo-100260526140346065.htm',
    title: { en: 'Campaign: “Watch World Cup on VTVgo”', vi: 'Chiến dịch: “Xem World Cup trên VTVgo”' },
    subtitle: { en: 'VTVgo × Mobifone', vi: 'VTVgo × Mobifone' },
    excerpt: {
      en: 'An integrated marketing campaign promoting the World Cup VIP package on the VTVgo app and for Mobifone users.',
      vi: 'Chiến dịch marketing tích hợp quảng bá gói VIP World Cup trên ứng dụng VTVgo và cho thuê bao Mobifone.',
    },
    body: {
      en: [
        'We delivered an integrated marketing campaign promoting the World Cup VIP package on VTVgo app and promotion for Mobifone users.',
        'Our scope included creative design, media promotion, KOL partnerships and TVC production, with a performance-driven strategy focused on achieving subscription sales KPIs.',
      ],
      vi: [
        'Chúng tôi triển khai chiến dịch marketing tích hợp quảng bá gói VIP World Cup trên ứng dụng VTVgo, cùng chương trình khuyến mãi dành cho thuê bao Mobifone.',
        'Phạm vi công việc bao gồm thiết kế sáng tạo, truyền thông, hợp tác KOL và sản xuất TVC, với chiến lược tối ưu hiệu quả, tập trung vào KPI doanh số thuê bao.',
      ],
    },
  },
  {
    slug: 'trailer-lpbank-vleague-2026-27',
    order: 4,
    category: 'video-production',
    featured: true,
    year: '2026',
    cover: 'projects/trailer-2627-01',
    gallery: ['projects/trailer-2627-02'],
    videoUrl: 'https://www.youtube.com/watch?v=lfgRPDiej7o',
    title: { en: 'Trailer LPBank V.League 2026/27', vi: 'Trailer LPBank V.League 2026/27' },
    subtitle: { en: 'A new look. A new spirit. A new journey.', vi: 'Diện mạo mới. Tinh thần mới. Hành trình mới.' },
    excerpt: {
      en: 'Inspired by Vietnamese propaganda art, the trailer introduces a bold new visual identity.',
      vi: 'Lấy cảm hứng từ tranh cổ động Việt Nam, trailer giới thiệu một bản sắc thị giác mới đầy táo bạo.',
    },
    body: {
      en: [
        'Inspired by Vietnamese propaganda art, the trailer introduces a bold new visual identity that brings together tradition and modernity, national character and global integration.',
        'A new look. A new spirit. A new journey.',
      ],
      vi: [
        'Lấy cảm hứng từ nghệ thuật tranh cổ động Việt Nam, trailer giới thiệu một bản sắc thị giác mới đầy táo bạo — kết hợp truyền thống và hiện đại, bản sắc dân tộc và hội nhập quốc tế.',
        'Diện mạo mới. Tinh thần mới. Hành trình mới.',
      ],
    },
    quote: { en: 'World Game, Our Festival!', vi: 'World Game, Our Festival!' },
  },
  {
    slug: 'trailer-lpbank-vleague-2025-26',
    order: 5,
    category: 'video-production',
    year: '2025',
    cover: 'projects/trailer-2526-01',
    gallery: range('projects/trailer-2526', 2, 8),
    logo: 'projects/trailer-2526-logo-01',
    videoUrl: 'https://youtu.be/cnltCn6Gams',
    title: { en: 'Trailer LPBank V.League 2025/26', vi: 'Trailer LPBank V.League 2025/26' },
    subtitle: { en: 'Identity and Technology', vi: 'Bản sắc và Công nghệ' },
    excerpt: {
      en: 'Where machines represent more than technological power. They embody the spirit, culture, and unique identity of every team.',
      vi: 'Nơi những cỗ máy không chỉ là sức mạnh công nghệ, mà còn là hiện thân của tinh thần, văn hoá và bản sắc riêng của mỗi đội bóng.',
    },
    body: {
      en: [
        '**Identity and Technology.** Where machines represent more than technological power. They embody the spirit, culture, and unique identity of every team.',
      ],
      vi: [
        '**Bản sắc và Công nghệ.** Nơi những cỗ máy không chỉ đại diện cho sức mạnh công nghệ — chúng là hiện thân của tinh thần, văn hoá và bản sắc riêng của mỗi đội bóng.',
      ],
    },
  },
  {
    slug: 'trailer-lpbank-vleague-2024-25',
    order: 6,
    category: 'video-production',
    year: '2024',
    cover: 'projects/trailer-2425-01',
    gallery: range('projects/trailer-2425', 2, 12),
    logo: 'projects/trailer-2425-logo-01',
    videoUrl: 'https://youtu.be/DrrMbPCmUhE',
    title: { en: 'Trailer LPBank V.League 2024/25', vi: 'Trailer LPBank V.League 2024/25' },
    excerpt: {
      en: 'Where football and national culture grow together as one.',
      vi: 'Nơi bóng đá và văn hoá dân tộc cùng nhau lớn lên.',
    },
  },
  {
    slug: 'key-visual-design',
    order: 7,
    category: 'branding-design',
    featured: true,
    cover: 'projects/key-visual-01',
    gallery: range('projects/key-visual', 2, 13),
    title: { en: 'V.League Club Key Visuals', vi: 'Key visual các CLB V.League' },
    excerpt: {
      en: 'Illustrated key visuals celebrating the identity of each V.League club.',
      vi: 'Loạt key visual minh hoạ tôn vinh bản sắc riêng của từng câu lạc bộ V.League.',
    },
  },
  {
    slug: 'total-football-game-launch',
    order: 8,
    category: 'marketing-campaigns',
    cover: 'projects/game-launch-01',
    gallery: ['projects/game-launch-02'],
    title: { en: 'Total Football Game Launch', vi: 'Ra mắt game Total Football' },
    subtitle: { en: 'Total Football × VNG Games', vi: 'Total Football × VNG Games' },
    excerpt: {
      en: 'Launch creatives for the Total Football mobile game featuring Vietnamese football stars.',
      vi: 'Bộ ấn phẩm ra mắt game di động Total Football cùng các ngôi sao bóng đá Việt Nam.',
    },
  },
  {
    slug: 'book-1999-manchester-united',
    order: 9,
    category: 'events-publishing',
    featured: true,
    year: '2025',
    cover: 'projects/book-1999-01',
    gallery: ['projects/book-1999-02', 'services/publishing-01', 'services/publishing-02'],
    title: {
      en: '1999: Manchester United, the Treble and All That',
      vi: '1999: Manchester United, cú ăn ba và tất cả những điều đó',
    },
    subtitle: {
      en: 'Published by HTAd in 2025. Designed by Grammy nominee Duy Dao.',
      vi: 'HTAd xuất bản năm 2025. Thiết kế bởi đề cử Grammy Duy Đào.',
    },
    excerpt: {
      en: 'A sports book bringing the legendary 1999 Treble season closer to Vietnamese readers.',
      vi: 'Cuốn sách thể thao đưa mùa giải ăn ba huyền thoại 1999 đến gần hơn với độc giả Việt Nam.',
    },
  },
  {
    slug: 'next-generation-vietnam',
    order: 10,
    category: 'events-publishing',
    featured: true,
    cover: 'projects/next-gen-vietnam-01',
    gallery: range('projects/next-gen-vietnam', 2, 5),
    title: { en: 'Next Generation Vietnam', vi: 'Next Generation Vietnam' },
    subtitle: {
      en: 'Mitsubishi Heavy Industries × Urawa Reds',
      vi: 'Mitsubishi Heavy Industries × Urawa Reds',
    },
    excerpt: {
      en: 'A youth football talent selection program organized by Urawa Red Diamonds and Mitsubishi Heavy Industries in Hanoi.',
      vi: 'Chương trình tuyển chọn tài năng bóng đá trẻ do Urawa Red Diamonds và Mitsubishi Heavy Industries tổ chức tại Hà Nội.',
    },
    body: {
      en: [
        'A youth football talent selection program organized by Urawa Red Diamonds and Mitsubishi Heavy Industries in Hanoi. More than 30 promising players from five leading Vietnamese clubs participated in a series of professional assessments.',
        'Two outstanding players were selected for a two-week training experience with Urawa Reds U21 in Japan.',
        '**HTAd is in charge of consultancy and event organization.**',
      ],
      vi: [
        'Chương trình tuyển chọn tài năng bóng đá trẻ do Urawa Red Diamonds và Mitsubishi Heavy Industries tổ chức tại Hà Nội. Hơn 30 cầu thủ triển vọng đến từ năm câu lạc bộ hàng đầu Việt Nam đã tham gia chuỗi bài đánh giá chuyên môn.',
        'Hai cầu thủ xuất sắc nhất được chọn sang Nhật Bản tập luyện hai tuần cùng đội U21 Urawa Reds.',
        '**HTAd phụ trách tư vấn và tổ chức sự kiện.**',
      ],
    },
  },
  {
    slug: 'fan-culture-event',
    order: 11,
    category: 'events-publishing',
    cover: 'projects/culture-event-01',
    gallery: range('projects/culture-event', 2, 4),
    title: { en: 'Fan Culture Event', vi: 'Sự kiện văn hoá người hâm mộ' },
    excerpt: {
      en: 'Community events bringing football and pop-culture fans together.',
      vi: 'Những sự kiện cộng đồng gắn kết người hâm mộ bóng đá và văn hoá đại chúng.',
    },
  },
]

export type SeedService = {
  slug: string
  order: number
  cover: string
  gallery: string[]
  partnerLogos?: string[]
  relatedProjects?: string[]
  title: L
  headline?: L
  excerpt: L
  body: L<string[]>
  highlights?: L<string[]>
  galleryCaption?: L
}

export const services: SeedService[] = [
  {
    slug: 'consultancy',
    order: 1,
    cover: 'services/consultancy-02',
    gallery: ['services/consultancy-01', 'services/consultancy-03'],
    title: { en: 'Consultancy', vi: 'Tư vấn chiến lược' },
    excerpt: {
      en: 'Strategic consultancy for organizations and businesses seeking to engage with the Vietnamese football ecosystem.',
      vi: 'Tư vấn chiến lược cho các tổ chức, doanh nghiệp muốn tham gia vào hệ sinh thái bóng đá Việt Nam.',
    },
    body: {
      en: [
        'HTAd provides strategic consultancy services for organizations and businesses seeking to engage with the Vietnamese football ecosystem.',
      ],
      vi: [
        'HTAd cung cấp dịch vụ tư vấn chiến lược cho các tổ chức và doanh nghiệp mong muốn tham gia vào hệ sinh thái bóng đá Việt Nam.',
      ],
    },
    highlights: {
      en: [
        'Connecting brands with football clubs and fan communities.',
        'Facilitating strategic partnerships.',
        'Identifying and securing sponsorship opportunities with leagues, clubs, and players.',
        'Advising on market strategies and commercial positioning in Vietnam’s sports industry.',
        'Supporting media, broadcasting, and related investments, including rights acquisition and distribution.',
      ],
      vi: [
        'Kết nối thương hiệu với các câu lạc bộ bóng đá và cộng đồng người hâm mộ.',
        'Thúc đẩy các mối quan hệ đối tác chiến lược.',
        'Tìm kiếm và khai thác cơ hội tài trợ với các giải đấu, câu lạc bộ và cầu thủ.',
        'Tư vấn chiến lược thị trường và định vị thương mại trong ngành thể thao Việt Nam.',
        'Hỗ trợ đầu tư truyền thông, phát sóng và các lĩnh vực liên quan, bao gồm mua và phân phối bản quyền.',
      ],
    },
    galleryCaption: {
      en: 'The V.League trophies, designed and crafted by Thomas Lyte, a famous British jeweler. Project coordinated by HTAd.',
      vi: 'Bộ cúp V.League do Thomas Lyte — nhà kim hoàn nổi tiếng của Anh — thiết kế và chế tác. Dự án do HTAd điều phối.',
    },
  },
  {
    slug: 'business-consultancy-partnership',
    order: 2,
    cover: 'services/partnership-01',
    gallery: ['services/partnership-02', 'services/partnership-03', 'services/partnership-04'],
    partnerLogos: ['services/partnership-logo-01', 'services/partnership-logo-02'],
    title: { en: 'Business Consultancy & Partnership', vi: 'Tư vấn kinh doanh & Hợp tác' },
    headline: {
      en: 'Connecting LPBank and Ninh Binh FC with J.League and leading Japanese Football Clubs',
      vi: 'Kết nối LPBank và CLB Ninh Bình với J.League cùng các CLB hàng đầu Nhật Bản',
    },
    excerpt: {
      en: 'We help Vietnamese enterprises establish meaningful connections and explore partnership opportunities in Asia.',
      vi: 'Chúng tôi giúp doanh nghiệp Việt Nam xây dựng những kết nối ý nghĩa và mở ra cơ hội hợp tác tại châu Á.',
    },
    body: {
      en: [
        'We facilitated a professional visit to connect LP Bank - one of the largest joint-stock commercial banks in Vietnam and Ninh Binh FC with J.League, Kashima Antlers and Urawa Red Diamonds.',
        'Through meetings and site visits, the delegation gained valuable insights into club management, youth development, sports science, fan engagement and brand building, while exploring future cooperation in coaching, player development and friendly matches.',
        '**We help Vietnamese enterprises establish meaningful connections and explore partnership opportunities in Asia.**',
      ],
      vi: [
        'Chúng tôi đã tổ chức chuyến thăm và làm việc chuyên môn, kết nối LPBank — một trong những ngân hàng thương mại cổ phần lớn nhất Việt Nam — và CLB Ninh Bình với J.League, Kashima Antlers và Urawa Red Diamonds.',
        'Qua các buổi làm việc và tham quan thực tế, đoàn đã có được nhiều bài học quý giá về quản trị câu lạc bộ, đào tạo trẻ, khoa học thể thao, gắn kết người hâm mộ và xây dựng thương hiệu, đồng thời mở ra hướng hợp tác về huấn luyện, phát triển cầu thủ và các trận giao hữu.',
        '**Chúng tôi giúp doanh nghiệp Việt Nam xây dựng những kết nối ý nghĩa và mở ra cơ hội hợp tác tại châu Á.**',
      ],
    },
  },
  {
    slug: 'broadcast-rights',
    order: 3,
    cover: 'services/broadcast-01',
    gallery: [],
    partnerLogos: ['services/broadcast-logo-01'],
    title: { en: 'Broadcast Rights', vi: 'Bản quyền phát sóng' },
    headline: {
      en: 'Official and exclusive broadcast rights holder of the J.LEAGUE in Vietnam',
      vi: 'Đơn vị nắm giữ bản quyền phát sóng chính thức và độc quyền J.LEAGUE tại Việt Nam',
    },
    excerpt: {
      en: 'HTAd is the official and exclusive broadcast rights holder of the Japan Professional Football League (J.LEAGUE) in Vietnam.',
      vi: 'HTAd là đơn vị nắm giữ bản quyền phát sóng chính thức và độc quyền Giải bóng đá Chuyên nghiệp Nhật Bản (J.LEAGUE) tại Việt Nam.',
    },
    body: {
      en: [
        'HTAd is the **official and exclusive** broadcast rights holder of the **Japan Professional Football League (J.LEAGUE)** in Vietnam.',
      ],
      vi: [
        'HTAd là đơn vị nắm giữ bản quyền phát sóng **chính thức và độc quyền** của **Giải bóng đá Chuyên nghiệp Nhật Bản (J.LEAGUE)** tại Việt Nam.',
      ],
    },
  },
  {
    slug: 'content-licensing',
    order: 4,
    cover: 'services/licensing-01',
    gallery: [],
    title: { en: 'Content Licensing', vi: 'Cấp phép nội dung' },
    excerpt: {
      en: 'We acquire, represent and distribute premium sports, anime and entertainment content in Vietnam.',
      vi: 'Chúng tôi mua bản quyền, đại diện và phân phối nội dung thể thao, anime và giải trí cao cấp tại Việt Nam.',
    },
    body: {
      en: [
        'We acquire, represent and distribute premium sports, anime and entertainment content in Vietnam.',
        'Our end-to-end services cover rights negotiation, localization, technical delivery, sublicensing and distribution across television, OTT and digital platforms.',
      ],
      vi: [
        'Chúng tôi mua bản quyền, đại diện và phân phối các nội dung thể thao, anime và giải trí cao cấp tại Việt Nam.',
        'Dịch vụ trọn gói của chúng tôi bao gồm đàm phán bản quyền, bản địa hoá, bàn giao kỹ thuật, cấp phép lại và phân phối trên truyền hình, OTT và các nền tảng số.',
      ],
    },
    highlights: {
      en: ['Rights negotiation', 'Localization', 'Technical delivery', 'Sublicensing', 'TV, OTT & digital distribution'],
      vi: ['Đàm phán bản quyền', 'Bản địa hoá', 'Bàn giao kỹ thuật', 'Cấp phép lại', 'Phân phối TV, OTT & nền tảng số'],
    },
  },
  {
    slug: 'publishing',
    order: 5,
    cover: 'services/publishing-01',
    gallery: ['services/publishing-02'],
    relatedProjects: ['book-1999-manchester-united'],
    title: { en: 'Publishing', vi: 'Xuất bản' },
    excerpt: {
      en: 'Sports books that bring inspiring stories, iconic players, and football culture closer to Vietnamese readers.',
      vi: 'Những cuốn sách thể thao đưa câu chuyện truyền cảm hứng, cầu thủ biểu tượng và văn hoá bóng đá đến gần hơn với độc giả Việt.',
    },
    body: {
      en: [
        'HTAd develops and publishes sports-related books that bring inspiring stories, iconic players, and football culture closer to Vietnamese readers.',
        'We manage the full process from content development and localization to distribution and promotion, ensuring each publication is both engaging and commercially viable.',
      ],
      vi: [
        'HTAd phát triển và xuất bản các đầu sách thể thao, đưa những câu chuyện truyền cảm hứng, các cầu thủ biểu tượng và văn hoá bóng đá đến gần hơn với độc giả Việt Nam.',
        'Chúng tôi quản lý toàn bộ quy trình từ phát triển nội dung, bản địa hoá đến phát hành và quảng bá, đảm bảo mỗi ấn phẩm vừa hấp dẫn vừa hiệu quả về mặt thương mại.',
      ],
    },
    galleryCaption: {
      en: '1999: Manchester United, the Treble and All That, published by HTAd in 2025. Designed by Grammy nominee Duy Dao.',
      vi: '1999: Manchester United, the Treble and All That — HTAd xuất bản năm 2025. Thiết kế bởi đề cử Grammy Duy Đào.',
    },
  },
  {
    slug: 'sport-production',
    order: 6,
    cover: 'services/production-01',
    gallery: [],
    relatedProjects: [
      'trailer-lpbank-vleague-2026-27',
      'trailer-lpbank-vleague-2025-26',
      'trailer-lpbank-vleague-2024-25',
    ],
    title: { en: 'Sport Production', vi: 'Sản xuất nội dung thể thao' },
    excerpt: {
      en: 'High-impact sports promotion that captures the emotion and energy of the game while driving audience engagement.',
      vi: 'Nội dung quảng bá thể thao ấn tượng, truyền tải trọn vẹn cảm xúc và năng lượng trận đấu, thúc đẩy tương tác khán giả.',
    },
    body: {
      en: [
        'HTAd produces high-impact sports promotion that captures the emotion and energy of the game while driving audience engagement.',
        'Our services include trailers, promotional videos, highlights and short-form digital content optimized for TV, OTT and social media.',
        'By combining storytelling with platform expertise, we help partners maximize reach, engagement, and commercial value.',
      ],
      vi: [
        'HTAd sản xuất các nội dung quảng bá thể thao ấn tượng, truyền tải trọn vẹn cảm xúc và năng lượng của trận đấu, đồng thời thúc đẩy tương tác của khán giả.',
        'Dịch vụ của chúng tôi gồm trailer, video quảng bá, highlight và nội dung số dạng ngắn được tối ưu cho truyền hình, OTT và mạng xã hội.',
        'Kết hợp nghệ thuật kể chuyện với am hiểu nền tảng, chúng tôi giúp đối tác tối đa hoá độ phủ, tương tác và giá trị thương mại.',
      ],
    },
    highlights: {
      en: ['Trailers', 'Promotional videos', 'Highlights', 'Short-form digital content'],
      vi: ['Trailer', 'Video quảng bá', 'Highlight', 'Nội dung số dạng ngắn'],
    },
  },
  {
    slug: 'advertising-sponsorship',
    order: 7,
    cover: 'services/advertising-02',
    gallery: ['services/advertising-01'],
    partnerLogos: ['services/advertising-logo-01'],
    title: { en: 'Advertising & Sponsorship', vi: 'Quảng cáo & Tài trợ' },
    excerpt: {
      en: 'Direct access to pitch-side advertising boards across Vietnam’s professional football leagues and nearly 300 digital boards nationwide.',
      vi: 'Tiếp cận trực tiếp bảng quảng cáo sân cỏ tại các giải chuyên nghiệp Việt Nam cùng mạng lưới gần 300 bảng quảng cáo điện tử toàn quốc.',
    },
    body: {
      en: [
        'HTAd provides direct access to **pitch-side advertising** boards across Vietnam’s professional football leagues.',
        'In addition, we offer a network of nearly 300 **digital advertising boards** nationwide, enabling brands to amplify visibility both inside stadiums and across key public locations.',
        'We can get access to a wide range of advertising options on **Zalo** - the most popular messaging app in Vietnam, as well as their e-wallet platform Zalopay.',
      ],
      vi: [
        'HTAd cung cấp quyền tiếp cận trực tiếp hệ thống **bảng quảng cáo sân cỏ** tại các giải bóng đá chuyên nghiệp Việt Nam.',
        'Bên cạnh đó, chúng tôi sở hữu mạng lưới gần 300 **bảng quảng cáo điện tử** trên toàn quốc, giúp thương hiệu gia tăng độ nhận diện cả trong sân vận động lẫn tại các địa điểm công cộng trọng điểm.',
        'Chúng tôi có thể tiếp cận nhiều hình thức quảng cáo trên **Zalo** — ứng dụng nhắn tin phổ biến nhất Việt Nam — cùng nền tảng ví điện tử Zalopay.',
      ],
    },
    highlights: {
      en: ['Pitch-side LED boards', '~300 digital boards nationwide', 'Zalo & Zalopay advertising'],
      vi: ['Bảng LED sân cỏ', '~300 bảng quảng cáo điện tử toàn quốc', 'Quảng cáo trên Zalo & Zalopay'],
    },
  },
]

export const home = {
  slides: [
    'projects/vleague-rebrand-01',
    'services/broadcast-01',
    'projects/trailer-2627-01',
    'projects/key-visual-01',
  ],
  partnerLogos: [
    'services/broadcast-logo-01',
    'services/partnership-logo-01',
    'services/partnership-logo-02',
    'services/advertising-logo-01',
    'projects/trailer-2526-logo-01',
  ],
  en: {
    hero: {
      eyebrow: 'Huu Tin Trading & Advertising',
      title: 'Premium content.\nEngaged audiences.',
      subtitle:
        'A Vietnam-based media and content distribution agency specializing in sports and entertainment.',
    },
    marquee: [
      'Consultancy',
      'Broadcast Rights',
      'Content Licensing',
      'Publishing',
      'Sport Production',
      'Advertising',
      'Sponsorship',
    ],
    stats: [
      { value: 10, prefix: '~', suffix: '', label: 'Years in sport media' },
      { value: 300, prefix: '~', suffix: '', label: 'Digital advertising boards nationwide' },
      { value: 2, prefix: '', suffix: '', label: 'Markets: Vietnam & Japan' },
      { value: 1, prefix: '#', suffix: '', label: 'Exclusive J.LEAGUE rights holder in Vietnam' },
    ],
    servicesSection: {
      heading: 'What we do',
      text: 'From rights and licensing to production, publishing and sponsorship — end-to-end solutions across the sports and entertainment ecosystem.',
    },
    projectsSection: {
      heading: 'Selected works',
      text: 'Branding, campaigns, trailers, key visuals, publishing and events for Vietnam’s leading football organisations.',
    },
    cta: {
      heading: 'Let’s create the next big moment together.',
      text: 'Partnerships, broadcast rights, production or sponsorship — talk to our team.',
    },
  },
  vi: {
    hero: {
      eyebrow: 'Hữu Tín Trading & Advertising',
      title: 'Nội dung đỉnh cao.\nKhán giả cuồng nhiệt.',
      subtitle: 'Công ty truyền thông và phân phối nội dung tại Việt Nam, chuyên về thể thao và giải trí.',
    },
    marquee: [
      'Tư vấn',
      'Bản quyền phát sóng',
      'Cấp phép nội dung',
      'Xuất bản',
      'Sản xuất thể thao',
      'Quảng cáo',
      'Tài trợ',
    ],
    stats: [
      { value: 10, prefix: '~', suffix: '', label: 'Năm trong ngành truyền thông thể thao' },
      { value: 300, prefix: '~', suffix: '', label: 'Bảng quảng cáo điện tử toàn quốc' },
      { value: 2, prefix: '', suffix: '', label: 'Thị trường: Việt Nam & Nhật Bản' },
      { value: 1, prefix: '#', suffix: '', label: 'Đơn vị độc quyền bản quyền J.LEAGUE tại Việt Nam' },
    ],
    servicesSection: {
      heading: 'Lĩnh vực hoạt động',
      text: 'Từ bản quyền, cấp phép đến sản xuất, xuất bản và tài trợ — giải pháp trọn gói trong hệ sinh thái thể thao và giải trí.',
    },
    projectsSection: {
      heading: 'Dự án tiêu biểu',
      text: 'Nhận diện thương hiệu, chiến dịch, trailer, key visual, xuất bản và sự kiện cho các tổ chức bóng đá hàng đầu Việt Nam.',
    },
    cta: {
      heading: 'Cùng nhau tạo nên khoảnh khắc lớn tiếp theo.',
      text: 'Hợp tác, bản quyền phát sóng, sản xuất hay tài trợ — hãy trò chuyện với chúng tôi.',
    },
  },
}

export const about = {
  image: 'services/consultancy-01',
  founderPhoto: 'about/founder-01',
  founderName: 'Nguyen Ba Phu',
  en: {
    heading: 'About us',
    lead: 'Huu Tin Trading and Advertising Company Limited (HTAd) is a Vietnam-based media and content distribution agency specializing in sports and entertainment.',
    body: [
      'With nearly a decade of experience, we have built a strong reputation for connecting premium content with highly engaged audiences.',
      'Originally rooted in sport media, Huu Tin Trading & Advertising (HTAd) has developed an extensive network across Vietnam and Japan sports ecosystem, including broadcasters, digital platforms, sponsors and fan communities.',
    ],
    pillars: [
      { title: 'Broadcasters', text: 'Long-standing relationships with TV and OTT partners.' },
      { title: 'Digital platforms', text: 'Distribution and promotion across digital and social channels.' },
      { title: 'Sponsors', text: 'Connecting brands with leagues, clubs and players.' },
      { title: 'Fan communities', text: 'Deep insight into Vietnamese fan culture.' },
    ],
    founderRole: 'Founder',
    founderBio: [
      '**Mr. NGUYEN BA PHU**, one of Vietnam’s most recognized football commentators and sport media personalities.',
      'In 2023, he became the only Vietnamese producer selected by FIFA for the FIFA Women’s World Cup.',
      'Leveraging his extensive network within the sports and media industry, as well as his insight into fan culture, Mr. Phu established HTAd with the vision of bridging premium international content with local audiences.',
    ],
    founderQuote: 'Bridging premium international content with local audiences.',
  },
  vi: {
    heading: 'Về chúng tôi',
    lead: 'Công ty TNHH Thương mại và Quảng cáo Hữu Tín (HTAd) là công ty truyền thông và phân phối nội dung tại Việt Nam, chuyên về thể thao và giải trí.',
    body: [
      'Với gần một thập kỷ kinh nghiệm, chúng tôi đã xây dựng uy tín vững chắc trong việc kết nối những nội dung đỉnh cao với lượng khán giả trung thành và cuồng nhiệt.',
      'Khởi nguồn từ truyền thông thể thao, HTAd đã phát triển mạng lưới rộng khắp trong hệ sinh thái thể thao Việt Nam và Nhật Bản, bao gồm các đài truyền hình, nền tảng số, nhà tài trợ và cộng đồng người hâm mộ.',
    ],
    pillars: [
      { title: 'Đài truyền hình', text: 'Quan hệ lâu năm với các đối tác truyền hình và OTT.' },
      { title: 'Nền tảng số', text: 'Phân phối và quảng bá trên các kênh số và mạng xã hội.' },
      { title: 'Nhà tài trợ', text: 'Kết nối thương hiệu với giải đấu, câu lạc bộ và cầu thủ.' },
      { title: 'Cộng đồng người hâm mộ', text: 'Thấu hiểu sâu sắc văn hoá người hâm mộ Việt Nam.' },
    ],
    founderRole: 'Nhà sáng lập',
    founderBio: [
      '**Ông NGUYỄN BÁ PHÚ** — một trong những bình luận viên bóng đá và gương mặt truyền thông thể thao được biết đến nhiều nhất Việt Nam.',
      'Năm 2023, ông là nhà sản xuất Việt Nam duy nhất được FIFA lựa chọn cho FIFA Women’s World Cup.',
      'Với mạng lưới quan hệ rộng trong ngành thể thao, truyền thông cùng sự thấu hiểu văn hoá người hâm mộ, ông Phú thành lập HTAd với tầm nhìn đưa những nội dung quốc tế đỉnh cao đến gần hơn với khán giả Việt Nam.',
    ],
    founderQuote: 'Đưa nội dung quốc tế đỉnh cao đến gần hơn với khán giả Việt Nam.',
  },
}

export const settings = {
  companyName: 'Huu Tin Trading and Advertising Company Limited',
  shortName: 'HTAd',
  logo: 'brand/logo-horizontal-01',
  logoStacked: 'brand/logo-stacked-01',
  ogImage: 'projects/vleague-rebrand-01',
  contact: {
    phone: '(+84) 91 599 0246',
    email: 'huutin@htad.com.vn',
    website: 'www.htad.com.vn',
    mapUrl: 'https://maps.google.com/?q=29T1+Hoang+Dao+Thuy,+Hanoi',
  },
  en: {
    tagline: 'Sports & entertainment media agency',
    address: 'Room 16, Floor 2, 29T1 Hoang Dao Thuy street, Hanoi, Vietnam',
    city: 'Hanoi, Vietnam',
    seoTitle: 'Huu Tin Trading & Advertising (HTAd)',
    seoDescription:
      'HTAd is a Vietnam-based media and content distribution agency specializing in sports and entertainment — consultancy, broadcast rights, licensing, publishing, production and sponsorship.',
  },
  vi: {
    tagline: 'Công ty truyền thông thể thao & giải trí',
    address: 'Phòng 16, Tầng 2, 29T1 Hoàng Đạo Thúy, Hà Nội, Việt Nam',
    city: 'Hà Nội, Việt Nam',
    seoTitle: 'Hữu Tín Trading & Advertising (HTAd)',
    seoDescription:
      'HTAd là công ty truyền thông và phân phối nội dung tại Việt Nam, chuyên về thể thao và giải trí — tư vấn, bản quyền phát sóng, cấp phép, xuất bản, sản xuất và tài trợ.',
  },
}
