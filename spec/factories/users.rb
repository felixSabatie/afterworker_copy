FactoryBot.define do
  factory :user do
    sequence(:username) { |i| "username#{i}" }
    sequence(:email) { |i| "email#{i}@test.com" }
    password { 'password' }
    password_confirmation { 'password' }
    avatar_link { 'https://api.adorable.io/avatars/285/test@test.com.png' }

    factory :wrong_password_confirmation_user do
      password_confirmation { 'wrong' }
    end

  end
end
