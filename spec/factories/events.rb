FactoryBot.define do
  factory :event do
    sequence(:name) { |i| "Event #{i}" }
    is_open_to_dates { false }
    is_open_to_places { false }
    has_date_poll { false }
    has_place_poll { false }
    creator { nil }
    event_hash { nil }
  end
end
