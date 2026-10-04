# Hand-written migration — adding founder_name/founder_title to SiteSettings
# and creating BannerImage with order field from day one.
# No production data exists yet so this is safe to apply immediately.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        # 1. Add founder fields to the singleton SiteSettings row
        migrations.AddField(
            model_name="sitesettings",
            name="founder_name",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="founder_title",
            field=models.CharField(blank=True, max_length=200),
        ),
        # 2. Create BannerImage table with order field included from the start
        migrations.CreateModel(
            name="BannerImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(blank=True, max_length=200)),
                ("subtitle", models.CharField(blank=True, max_length=400)),
                ("image", models.ImageField(upload_to="banners/")),
                (
                    "order",
                    models.PositiveIntegerField(
                        db_index=True,
                        default=0,
                        help_text="Lower numbers appear first in the carousel.",
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Banner Image",
                "verbose_name_plural": "Banner Images",
                "ordering": ["order", "created_at"],
            },
        ),
    ]
