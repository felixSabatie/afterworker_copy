FactoryBot.define do
  factory :event do
    name { "MyString" }
    is_open_to_dates { false }
    is_open_to_places { false }
    hash { "MyString" }
    has_date_poll { false }
    has_place_poll { false }
    user { nil }
  end
end
