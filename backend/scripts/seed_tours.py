from decimal import Decimal

from app.core.database import SessionLocal
from app.models.destination import Destination
from app.models.tour import Tour


TOURS = [
    # Phú Quốc
    {
        "title": "Phú Quốc 3N2Đ - Biển Xanh Nghỉ Dưỡng",
        "description": "Khám phá những bãi biển đẹp, hoàng hôn và các trải nghiệm nổi bật tại Phú Quốc.",
        "destination_id": "phu-quoc",
        "duration_days": 3,
        "price": Decimal("3990000.00"),
        "max_guests": 20,
        "rating": Decimal("4.8"),
        "image": "",
    },
    {
        "title": "Phú Quốc 4N3Đ - Đảo Ngọc Trọn Vẹn",
        "description": "Hành trình nghỉ dưỡng kết hợp tham quan các điểm nổi bật trên đảo Phú Quốc.",
        "destination_id": "phu-quoc",
        "duration_days": 4,
        "price": Decimal("5590000.00"),
        "max_guests": 20,
        "rating": Decimal("4.9"),
        "image": "",
    },

    # Đà Nẵng
    {
        "title": "Đà Nẵng 3N2Đ - Biển Và Thành Phố",
        "description": "Khám phá biển Mỹ Khê, bán đảo Sơn Trà và những điểm nổi bật của Đà Nẵng.",
        "destination_id": "da-nang",
        "duration_days": 3,
        "price": Decimal("3290000.00"),
        "max_guests": 25,
        "rating": Decimal("4.7"),
        "image": "",
    },
    {
        "title": "Đà Nẵng - Hội An 4N3Đ",
        "description": "Kết hợp trải nghiệm Đà Nẵng và phố cổ Hội An trong một hành trình.",
        "destination_id": "da-nang",
        "duration_days": 4,
        "price": Decimal("4690000.00"),
        "max_guests": 20,
        "rating": Decimal("4.8"),
        "image": "",
    },

    # Hội An
    {
        "title": "Hội An 2N1Đ - Phố Cổ Và Đèn Lồng",
        "description": "Trải nghiệm phố cổ Hội An, ẩm thực địa phương và không gian đèn lồng về đêm.",
        "destination_id": "hoi-an",
        "duration_days": 2,
        "price": Decimal("2490000.00"),
        "max_guests": 20,
        "rating": Decimal("4.8"),
        "image": "",
    },
    {
        "title": "Hội An 3N2Đ - Văn Hóa Và Nghỉ Dưỡng",
        "description": "Khám phá văn hóa địa phương kết hợp thời gian nghỉ dưỡng tại Hội An.",
        "destination_id": "hoi-an",
        "duration_days": 3,
        "price": Decimal("3590000.00"),
        "max_guests": 20,
        "rating": Decimal("4.7"),
        "image": "",
    },

    # Nha Trang
    {
        "title": "Nha Trang 3N2Đ - Biển Xanh",
        "description": "Tận hưởng biển, đảo và các hoạt động thư giãn tại Nha Trang.",
        "destination_id": "nha-trang",
        "duration_days": 3,
        "price": Decimal("3190000.00"),
        "max_guests": 25,
        "rating": Decimal("4.6"),
        "image": "",
    },
    {
        "title": "Nha Trang 4N3Đ - Biển Và Đảo",
        "description": "Khám phá các điểm ven biển và trải nghiệm đảo trong hành trình 4 ngày.",
        "destination_id": "nha-trang",
        "duration_days": 4,
        "price": Decimal("4490000.00"),
        "max_guests": 20,
        "rating": Decimal("4.7"),
        "image": "",
    },

    # Hạ Long
    {
        "title": "Hạ Long 2N1Đ - Vịnh Và Du Thuyền",
        "description": "Trải nghiệm cảnh quan đặc trưng của vịnh Hạ Long kết hợp nghỉ dưỡng.",
        "destination_id": "ha-long",
        "duration_days": 2,
        "price": Decimal("3990000.00"),
        "max_guests": 20,
        "rating": Decimal("4.8"),
        "image": "",
    },
    {
        "title": "Hạ Long 3N2Đ - Khám Phá Vịnh",
        "description": "Hành trình khám phá vịnh Hạ Long với thời gian nghỉ dưỡng thoải mái.",
        "destination_id": "ha-long",
        "duration_days": 3,
        "price": Decimal("5290000.00"),
        "max_guests": 20,
        "rating": Decimal("4.9"),
        "image": "",
    },

    # Đà Lạt
    {
        "title": "Đà Lạt 3N2Đ - Thành Phố Ngàn Hoa",
        "description": "Khám phá khí hậu mát mẻ, cảnh quan và các điểm tham quan nổi bật tại Đà Lạt.",
        "destination_id": "da-lat",
        "duration_days": 3,
        "price": Decimal("2990000.00"),
        "max_guests": 25,
        "rating": Decimal("4.7"),
        "image": "",
    },
    {
        "title": "Đà Lạt 4N3Đ - Nghỉ Dưỡng Lãng Mạn",
        "description": "Hành trình thư giãn kết hợp trải nghiệm thiên nhiên và văn hóa Đà Lạt.",
        "destination_id": "da-lat",
        "duration_days": 4,
        "price": Decimal("4190000.00"),
        "max_guests": 20,
        "rating": Decimal("4.8"),
        "image": "",
    },

    # TP.HCM
    {
        "title": "TP.HCM City Tour 2N1Đ",
        "description": "Khám phá các điểm nổi bật về văn hóa, lịch sử và ẩm thực tại TP.HCM.",
        "destination_id": "tp-hcm",
        "duration_days": 2,
        "price": Decimal("2290000.00"),
        "max_guests": 25,
        "rating": Decimal("4.5"),
        "image": "",
    },
    {
        "title": "TP.HCM 3N2Đ - Thành Phố Năng Động",
        "description": "Trải nghiệm thành phố, ẩm thực địa phương và những điểm đến nổi bật.",
        "destination_id": "tp-hcm",
        "duration_days": 3,
        "price": Decimal("3190000.00"),
        "max_guests": 25,
        "rating": Decimal("4.6"),
        "image": "",
    },

    # Huế
    {
        "title": "Huế 2N1Đ - Di Sản Cố Đô",
        "description": "Khám phá di sản, văn hóa và không gian yên bình của cố đô Huế.",
        "destination_id": "hue",
        "duration_days": 2,
        "price": Decimal("2490000.00"),
        "max_guests": 20,
        "rating": Decimal("4.7"),
        "image": "",
    },
    {
        "title": "Huế 3N2Đ - Văn Hóa Và Di Sản",
        "description": "Hành trình tìm hiểu văn hóa truyền thống và các điểm di sản nổi bật.",
        "destination_id": "hue",
        "duration_days": 3,
        "price": Decimal("3490000.00"),
        "max_guests": 20,
        "rating": Decimal("4.8"),
        "image": "",
    },

    # Hà Nội
    {
        "title": "Hà Nội 2N1Đ - Phố Cổ Và Ẩm Thực",
        "description": "Khám phá phố cổ, văn hóa và ẩm thực đặc trưng của Hà Nội.",
        "destination_id": "ha-noi",
        "duration_days": 2,
        "price": Decimal("2390000.00"),
        "max_guests": 25,
        "rating": Decimal("4.6"),
        "image": "",
    },
    {
        "title": "Hà Nội 3N2Đ - Lịch Sử Và Văn Hóa",
        "description": "Trải nghiệm lịch sử, văn hóa và nhịp sống hiện đại tại Hà Nội.",
        "destination_id": "ha-noi",
        "duration_days": 3,
        "price": Decimal("3390000.00"),
        "max_guests": 20,
        "rating": Decimal("4.7"),
        "image": "",
    },

    # Sa Pa
    {
        "title": "Sa Pa 3N2Đ - Núi Rừng Và Ruộng Bậc Thang",
        "description": "Khám phá cảnh quan núi rừng và những bản làng đặc trưng tại Sa Pa.",
        "destination_id": "sa-pa",
        "duration_days": 3,
        "price": Decimal("3590000.00"),
        "max_guests": 20,
        "rating": Decimal("4.8"),
        "image": "",
    },
    {
        "title": "Sa Pa 4N3Đ - Hành Trình Vùng Cao",
        "description": "Trải nghiệm thiên nhiên, bản làng và văn hóa địa phương tại Sa Pa.",
        "destination_id": "sa-pa",
        "duration_days": 4,
        "price": Decimal("4690000.00"),
        "max_guests": 20,
        "rating": Decimal("4.9"),
        "image": "",
    },
]


def seed_tours() -> None:
    db = SessionLocal()

    try:
        created_count = 0
        updated_count = 0

        for data in TOURS:
            destination = db.get(
                Destination,
                data["destination_id"],
            )

            if destination is None:
                raise ValueError(
                    f"Destination not found: {data['destination_id']}"
                )

            existing_tour = (
                db.query(Tour)
                .filter(Tour.title == data["title"])
                .first()
            )

            if existing_tour is None:
                db.add(Tour(**data))
                created_count += 1
            else:
                existing_tour.description = data["description"]
                existing_tour.destination_id = data["destination_id"]
                existing_tour.duration_days = data["duration_days"]
                existing_tour.price = data["price"]
                existing_tour.max_guests = data["max_guests"]
                existing_tour.rating = data["rating"]
                existing_tour.image = data["image"]
                updated_count += 1

        db.commit()

        print(f"Created: {created_count}")
        print(f"Updated: {updated_count}")
        print(f"Total: {len(TOURS)}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_tours()