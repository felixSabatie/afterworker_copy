require 'rails_helper'

RSpec.describe User, type: :model do
  it 'should accept and save the user' do
    user = build(:user)
    expect(user.save).to be true
  end

  it 'should refuse the user because of wrong password confirmation' do
    user = build(:wrong_password_confirmation_user)
    expect(user.save).to be false
    byebug user.errors
  end

  it 'should refuse the user because no password confirmation' do
    user = build(:no_password_confirmation_user)
    expect(user.save).to be false
    byebug user.errors
  end

  it 'should refuse the user because email already exists' do
    user = build(:user)
    user2 = build(:user)
    user2.email = user.email
    user.save
    expect(user2.save).to be false
    byebug user2.errors
  end

  it 'should refuse the user because pseudo already exists' do
    user = build(:user)
    user2 = build(:user)
    user2.pseudo = user.pseudo
    user.save
    expect(user2.save).to be false
    byebug user2.errors
  end
end
