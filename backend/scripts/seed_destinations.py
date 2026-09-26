from app.core.database import SessionLocal
from app.models.destination import Destination


DESTINATIONS = [
    {
        "id": "phu-quoc",
        "name": "Phú Quốc",
        "region": "Southern Vietnam",
        "description": "Tropical beaches, island escapes and unforgettable sunsets.",
        "image": "",
    },
    {
        "id": "da-nang",
        "name": "Đà Nẵng",
        "region": "Central Vietnam",
        "description": "Beautiful beaches, vibrant city life and iconic mountain landscapes.",
        "image": "",
    },
    {
        "id": "hoi-an",
        "name": "Hội An",
        "region": "Central Vietnam",
        "description": "A charming ancient town known for lanterns, heritage and local culture.",
        "image": "",
    },
    {
        "id": "nha-trang",
        "name": "Nha Trang",
        "region": "Central Vietnam",
        "description": "Sunny beaches, clear waters and relaxing coastal experiences.",
        "image": "",
    },
    {
        "id": "ha-long",
        "name": "Hạ Long",
        "region": "Northern Vietnam",
        "description": "Spectacular limestone islands, emerald waters and unforgettable cruises.",
        "image": "",
    },
    {
        "id": "da-lat",
        "name": "Đà Lạt",
        "region": "Highland Vietnam",
        "description": "Cool mountain weather, romantic scenery and peaceful landscapes.",
        "image": "",
    },
    {
        "id": "tp-hcm",
        "name": "TP.HCM",
        "region": "Southern Vietnam",
        "description": "A dynamic city filled with food, culture, history and modern experiences.",
        "image": "",
    },
    {
        "id": "hue",
        "name": "Huế",
        "region": "Central Vietnam",
        "description": "Imperial heritage, traditional culture and peaceful riverside scenery.",
        "image": "",
    },
    {
        "id": "ha-noi",
        "name": "Hà Nội",
        "region": "Northern Vietnam",
        "description": "Historic streets, local cuisine and a rich blend of tradition and modern life.",
        "image": "",
    },
    {
        "id": "sa-pa",
        "name": "Sa Pa",
        "region": "Northern Vietnam",
        "description": "Mountain adventures, terraced rice fields and unique local communities.",
        "image": "",
    },
]


def seed_destinations() -> None:
    db = SessionLocal()

    try:
        created_count = 0
        updated_count = 0

        for data in DESTINATIONS:
            destination = db.get(
                Destination,
                data["id"],
            )

            if destination is None:
                destination = Destination(**data)
                db.add(destination)
                created_count += 1
            else:
                destination.name = data["name"]
                destination.region = data["region"]
                destination.description = data["description"]
                destination.image = data["image"]
                updated_count += 1

        db.commit()

        print(f"Created: {created_count}")
        print(f"Updated: {updated_count}")
        print(f"Total: {len(DESTINATIONS)}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_destinations()