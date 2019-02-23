FactoryBot.define do
  factory :date_poll_option do
    date { Time.now + 10.days }
    event { nil }

    factory :date_poll_option_old do
      date { Time.now - 10.days }
    end
  end
end
