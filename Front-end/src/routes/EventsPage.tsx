import { CalendarDays, Clock3, MapPin, ArrowRight, Flower2, Users, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';

type EventItem = {
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image: string;
  description: string;
  highlights: string[];
};

const featuredEvent: EventItem = {
  title: 'Khóa Học Cắm Hoa Cơ Bản - Floral Starter Lab',
  date: '22/06/2026',
  time: '09:00 - 12:00',
  location: 'Peonia Atelier, TP. Hồ Chí Minh',
  type: 'Workshop sắp diễn ra',
  image: 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=1400&h=900&fit=crop',
  description:
    'Dành cho người mới bắt đầu, khóa học giúp bạn nắm được nền tảng chọn hoa, phối màu, xử lý form dáng và tự tay hoàn thiện một bó hoa mang phong cách riêng.',
  highlights: ['Học từ florist giàu kinh nghiệm', 'Tặng bộ dụng cụ cơ bản', 'Có hoa mang về sau buổi học'],
};

const upcomingEvents: EventItem[] = [
  {
    title: 'Masterclass Cắm Hoa Cưới',
    date: '28/06/2026',
    time: '14:00 - 17:00',
    location: 'Peonia Studio - Quận 1',
    type: 'Chuyên đề nâng cao',
    image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=1000&h=700&fit=crop',
    description: 'Khóa học chuyên sâu về concept hoa cưới, bó tay cô dâu và hoa bàn tiệc theo tone màu hiện đại.',
    highlights: ['Concept cưới hiện đại', 'Thực hành bó tay cô dâu', 'Tư vấn nghề florist'],
  },
  {
    title: 'Workshop Hoa Trang Trí Nhà Ở',
    date: '05/07/2026',
    time: '09:30 - 12:00',
    location: 'Peonia Atelier, TP. Hồ Chí Minh',
    type: 'Workshop phong cách sống',
    image: 'https://images.unsplash.com/photo-1487073240288-854ac7f1f2aa?w=1000&h=700&fit=crop',
    description: 'Học cách chọn hoa phù hợp từng khu vực trong nhà: phòng khách, bàn ăn, góc làm việc và sảnh tiếp đón.',
    highlights: ['Ứng dụng thực tế', 'Phong cách tối giản', 'Gợi ý bảo quản hoa'],
  },
  {
    title: 'Sự Kiện Ra Mắt Bộ Sưu Tập Mùa Hè',
    date: '12/07/2026',
    time: '18:30 - 20:30',
    location: 'Flagship Peonia - TP. Hồ Chí Minh',
    type: 'Event thương hiệu',
    image: 'https://images.unsplash.com/photo-1462473080617-cde27c46f6b3?w=1000&h=700&fit=crop',
    description: 'Buổi giới thiệu các mẫu hoa mùa hè, mini show demo cắm hoa trực tiếp và gặp gỡ đội ngũ florist của Peonia.',
    highlights: ['Ra mắt BST mới', 'Live demo cắm hoa', 'Mini gift cho khách tham dự'],
  },
];

const agenda = [
  'Khám phá nền tảng chọn hoa và phối màu',
  'Thực hành cắm bó hoa theo form hiện đại',
  'Tư vấn lộ trình học nâng cao & nghề florist',
  'Giao lưu, chụp ảnh và nhận quà lưu niệm',
];

export default function EventsPage() {
  return (
    <>
      <Header cartCount={0} />
      <main className="bg-[#fbf7f1]">
        <section className="border-b border-[#e7dfd3] bg-[linear-gradient(180deg,#fffaf4_0%,#fbf7f1_100%)] py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.45em] text-[#e38b67]">Events & Learning</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-6xl">
                Sự kiện sắp tới, lớp học cắm hoa, và những trải nghiệm mới tại Peonia
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6f665d] md:text-base">
                Đây là nơi chúng tôi cập nhật các workshop, khóa học và event đặc biệt trong thời gian tới. Mỗi sự kiện được thiết kế để bạn vừa học, vừa trải nghiệm, vừa mang về cảm hứng sáng tạo với hoa.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#upcoming-events" className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-900">
                  Xem sự kiện sắp diễn ra <ArrowRight className="h-4 w-4" />
                </a>
                <a href="/workshop" className="inline-flex items-center gap-2 rounded-full border border-[#e6ddd3] bg-white px-6 py-3 text-sm font-medium text-foreground transition hover:bg-[#fbf7f1]">
                  Đăng ký workshop
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[#e6ddd3] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <img src={featuredEvent.image} alt={featuredEvent.title} className="h-full min-h-[420px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.25em] backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" /> Sự kiện nổi bật
                </div>
                <h2 className="mt-4 font-serif text-3xl font-light leading-tight">{featuredEvent.title}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/90">{featuredEvent.description}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 backdrop-blur-sm"><CalendarDays className="h-4 w-4" /> {featuredEvent.date}</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 backdrop-blur-sm"><Clock3 className="h-4 w-4" /> {featuredEvent.time}</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 backdrop-blur-sm"><MapPin className="h-4 w-4" /> {featuredEvent.location}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e6ddd3] bg-white py-14">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            <div className="rounded-[1.5rem] border border-[#e6ddd3] bg-[#fbf7f1] p-6">
              <Users className="h-8 w-8 text-[#e38b67]" />
              <h3 className="mt-4 font-serif text-2xl font-light text-foreground">Dành cho người mới</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f665d]">Các lớp học được thiết kế dễ hiểu, phù hợp cả người chưa từng cắm hoa.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#e6ddd3] bg-[#fbf7f1] p-6">
              <Flower2 className="h-8 w-8 text-[#e38b67]" />
              <h3 className="mt-4 font-serif text-2xl font-light text-foreground">Thực hành trực tiếp</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f665d]">Bạn sẽ được tự tay thực hiện tác phẩm và mang sản phẩm về nhà.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#e6ddd3] bg-[#fbf7f1] p-6">
              <Sparkles className="h-8 w-8 text-[#e38b67]" />
              <h3 className="mt-4 font-serif text-2xl font-light text-foreground">Chia sẻ kinh nghiệm</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f665d]">Giới thiệu lộ trình học nâng cao, nghề florist và các ứng dụng thực tế.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#e6ddd3] bg-[#fbf7f1] p-6">
              <Clock3 className="h-8 w-8 text-[#e38b67]" />
              <h3 className="mt-4 font-serif text-2xl font-light text-foreground">Lịch sự kiện sắp tới</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f665d]">Cập nhật các workshop, lớp học và event theo mùa trong thời gian tới.</p>
            </div>
          </div>
        </section>

        <section id="upcoming-events" className="bg-[#f3ece3] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">Upcoming</p>
                <h2 className="mt-3 font-serif text-4xl font-light text-foreground">Sự kiện sắp diễn ra</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[#6f665d]">
                Danh sách dưới đây bao gồm các workshop và event nổi bật mà Peonia muốn giới thiệu đến bạn trong thời gian tới.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="overflow-hidden rounded-[2rem] border border-[#e6ddd3] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
                <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="relative min-h-[420px]">
                    <img src={featuredEvent.image} alt={featuredEvent.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-8 lg:p-10">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">{featuredEvent.type}</p>
                    <h3 className="mt-3 font-serif text-3xl font-light text-foreground">{featuredEvent.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#6f665d]">{featuredEvent.description}</p>

                    <div className="mt-6 space-y-3 rounded-[1.5rem] bg-[#fbf7f1] p-5">
                      {agenda.map((item) => (
                        <div key={item} className="flex items-start gap-3 text-sm text-[#6f665d]">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#e38b67]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-3 text-sm text-[#6f665d] sm:grid-cols-2">
                      <div className="rounded-2xl border border-[#eee4d8] bg-[#fbf7f1] p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-[#8f877d]">Thời gian</p>
                        <p className="mt-2 font-medium text-foreground">{featuredEvent.date}</p>
                        <p className="mt-1">{featuredEvent.time}</p>
                      </div>
                      <div className="rounded-2xl border border-[#eee4d8] bg-[#fbf7f1] p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-[#8f877d]">Địa điểm</p>
                        <p className="mt-2 font-medium text-foreground">{featuredEvent.location}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a href="/workshop" className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-900">
                        Đăng ký ngay <ArrowRight className="h-4 w-4" />
                      </a>
                      <button className="rounded-full border border-[#e6ddd3] bg-white px-5 py-3 text-sm text-foreground transition hover:bg-[#fbf7f1]">
                        Nhận tư vấn lịch học
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              <div className="grid gap-6">
                {upcomingEvents.map((event) => (
                  <article key={event.title} className="grid overflow-hidden rounded-[1.75rem] border border-[#e6ddd3] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.05)] md:grid-cols-[0.92fr_1.08fr]">
                    <div className="min-h-[240px]">
                      <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#8f877d]">{event.type}</p>
                      <h3 className="mt-3 font-serif text-2xl font-light text-foreground">{event.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#6f665d]">{event.description}</p>
                      <div className="mt-4 space-y-2 text-sm text-[#6f665d]">
                        <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#e38b67]" />{event.date}</div>
                        <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#e38b67]" />{event.time}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#e38b67]" />{event.location}</div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {event.highlights.map((highlight) => (
                          <span key={highlight} className="rounded-full bg-[#fbf7f1] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#6f665d]">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
