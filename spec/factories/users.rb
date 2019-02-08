FactoryBot.define do
  factory :user do
    sequence(:pseudo) { |i| "pseudo#{i}" }
    sequence(:email) { |i| "email#{i}@test.com" }
    password { 'password' }
    password_confirmation { 'password' }
    avatar_link { 'https://api.adorable.io/avatars/285/test@test.com.png' }
  end

  factory :wrong_password_confirmation_user do
    sequence(:pseudo) { |i| "pseudo#{i}" }
    sequence(:email) { |i| "email#{i}@test.com" }
    password { 'password' }
    password_confirmation { 'passwordaze' }
    avatar_link { 'https://api.adorable.io/avatars/285/test@test.com.png' }
  end

  factory :no_password_confirmation_user do
    sequence(:pseudo) { |i| "pseudo#{i}" }
    sequence(:email) { |i| "email#{i}@test.com" }
    password { 'password' }
    password_confirmation { 'passwordaze' }
    avatar_link { 'https://api.adorable.io/avatars/285/test@test.com.png' }
  end
end
