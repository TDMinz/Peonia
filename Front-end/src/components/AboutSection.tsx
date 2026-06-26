export function AboutSection() {
  return (
    <section className="border-y border-[#E5DCD3]/60 bg-[#FAF5EE]">
      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-2 md:px-8">
        <div className="min-h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1525591090431-d9d2d1d6b0d4?auto=format&fit=crop&w=1400&q=80"
            alt="About us"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center p-6 md:p-12">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8E8A82]">ABOUT US - THƯƠNG HIỆU BÔNG BY CATT</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Bông by catt – Gửi trọn yêu thương</h2>
            <p className="mt-6 text-sm leading-8 text-[#4a453e] md:text-base">
              Từ năm 2016, Bông by Catt được tạo nên với mong muốn trở thành thương hiệu hoa lụa cao cấp đầu tiên tại Việt Nam, nơi từng bó hoa, chiếc box và
              mọi chi tiết nhỏ đều được chăm chút như một món quà mang theo cảm xúc. Chúng tôi tin rằng vẻ đẹp không chỉ nằm ở hoa, mà còn ở cách một món quà
              được gói ghém, trao tay và lưu giữ trong ký ức.
            </p>
            <p className="mt-4 text-sm leading-8 text-[#4a453e] md:text-base">Mỗi thiết kế đều là một lời chúc được sắp đặt tinh tế, dành cho những khoảnh khắc đáng nhớ nhất.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
