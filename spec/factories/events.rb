FactoryBot.define do
  factory :event do
    sequence(:name) { |i| "Event #{i}" }
    is_open_to_dates { true }
    is_open_to_places { true }
    has_date_poll { true }
    has_place_poll { true }
  end
end
