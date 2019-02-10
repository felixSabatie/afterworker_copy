FactoryBot.define do
  factory :date_poll_option do
    date { Time.now + 10.days }
    event { nil }
  end
end
