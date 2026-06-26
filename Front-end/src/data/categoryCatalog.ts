export type CategoryCatalogItem = {
  slug: string;
  categoryLabel: string;
  title: string;
  breadcrumbRoot: string;
  description: string;
  bannerImage: string;
  categoryIds: string[];
};

export const categoryCatalog: Record<string, CategoryCatalogItem> = {
  'hoa-bo': {
    slug: 'hoa-bo',
    categoryLabel: 'Quà tặng',
    title: 'Hoa Bó',
    breadcrumbRoot: 'Quà tặng',
    description: 'Những bó hoa tươi, được chọn lọc kỹ càng và cắm thủ công bởi những nghệ nhân, mang đến sự tinh tế và lãng mạn.',
    bannerImage: 'https://images.unsplash.com/photo-1546421845-6471bdcf3b38?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000002'],
  },
  'hoa-gio': {
    slug: 'hoa-gio',
    categoryLabel: 'Quà tặng',
    title: 'Hoa Giỏ',
    breadcrumbRoot: 'Quà tặng',
    description: 'Những giỏ hoa được sắp đặt hài hòa, sang trọng và thích hợp cho các dịp chúc mừng, khai trương hoặc tri ân.',
    bannerImage: 'https://images.unsplash.com/photo-1519378058457-4c29e80e8c52?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000003'],
  },
  'hoa-mica': {
    slug: 'hoa-mica',
    categoryLabel: 'Quà tặng',
    title: 'Hoa Mica',
    breadcrumbRoot: 'Quà tặng',
    description: 'Tặng phẩm hiện đại với hộp mica trong suốt, nổi bật vẻ đẹp của từng cành hoa bên trong.',
    bannerImage: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000004'],
  },
  'sinh-nhat': {
    slug: 'sinh-nhat',
    categoryLabel: 'Quà tặng',
    title: 'Sinh Nhật',
    breadcrumbRoot: 'Quà tặng',
    description: 'Thiết kế dành riêng cho những dịp sinh nhật, rực rỡ và tràn đầy niềm vui.',
    bannerImage: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000005'],
  },
  'ngay-le': {
    slug: 'ngay-le',
    categoryLabel: 'Quà tặng',
    title: 'Ngày Lễ',
    breadcrumbRoot: 'Quà tặng',
    description: 'Lựa chọn hoa đặc biệt cho các ngày lễ quan trọng trong năm.',
    bannerImage: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000006'],
  },
  'tot-nghiep': {
    slug: 'tot-nghiep',
    categoryLabel: 'Quà tặng',
    title: 'Tốt Nghiệp',
    breadcrumbRoot: 'Quà tặng',
    description: 'Những bó hoa tri ân dành cho ngày lễ tốt nghiệp đầy ý nghĩa.',
    bannerImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000007'],
  },
  'trang-tri-nha-o': {    
    slug: 'trang-tri-nha-o',
    categoryLabel: 'Hoa nội thất',
    title: 'Trang Trí Nhà Ở',
    breadcrumbRoot: 'Hoa nội thất',
    description: 'Lan hồ điệp thanh nhã, phù hợp trang trí phòng khách, sảnh hoặc làm quà tặng sang trọng.',
    bannerImage: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000009'],
  },
  'trang-tri-van-phong': {
    slug: 'trang-tri-van-phong',
    categoryLabel: 'Hoa Trang Trí',
    title: 'Trang Trí Văn Phòng', 
    breadcrumbRoot: 'Hoa Trang Trí',
    description: 'Các tiểu cảnh xanh tươi tạo điểm nhấn sang trọng và gần gũi cho không gian sống.',
    bannerImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000010'],
  },
  'hoa-tai-sanh': {
    slug: 'hoa-tai-sanh',
    categoryLabel: 'Hoa Trang Trí',
    title: 'Hoa Tại Sảnh',
    breadcrumbRoot: 'Hoa Trang Trí',
    description: 'Thiết kế cho sảnh công ty, khách sạn, showroom với cảm giác sang trọng và đón tiếp.',
    bannerImage: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000011'],
  },
  'tieu-canh': {
    slug: 'tieu-canh',
    categoryLabel: 'Hoa Trang Trí',
    title: 'Tiểu Cảnh',
    breadcrumbRoot: 'Hoa Trang Trí',
    description: 'Bó hoa mini tinh gọn, dễ thương, phù hợp không gian nhỏ hoặc tặng quà bất ngờ.',
    bannerImage: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1600&h=700&fit=crop',
    categoryIds: ['686b00000000000000000012'],
  },
};
