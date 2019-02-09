require 'rails_helper'

RSpec.describe User, type: :model do
  it 'should accept and save the user' do
    user = build(:user)
    expect(user.save).to be true
  end

  it 'should refuse the user because of wrong password confirmation' do
    user = build(:wrong_password_confirmation_user)
    expect(user.save).to be false
    expect(user.errors.messages).to have_key(:password_confirmation)
  end

  it 'should refuse the user because email already exists' do
    user = build(:user)
    user2 = build(:user)
    user2.email = user.email
    user.save
    expect { user2.save }.to raise_error(ActiveRecord::RecordNotUnique)
  end

  it 'should refuse the user because pseudo already exists' do
    user = build(:user)
    user2 = build(:user)
    user2.pseudo = user.pseudo
    user.save
    expect { user2.save }.to raise_error(ActiveRecord::RecordNotUnique)
  end

  it 'should refuse the user because the email format is wrong' do
    user = build(:user)
    user.email = 'wrong@wrong'
    expect(user.save).to be false
    expect(user.errors.messages).to have_key(:email)

    user.email = 'wrong'
    expect(user.save).to be false
    expect(user.errors.messages).to have_key(:email)

    user.email = 'wrong.wrong.com'
    expect(user.save).to be false
    expect(user.errors.messages).to have_key(:email)
  end

  it 'should refuse password because too short' do
    user = build(:user)
    user.password = 'wrong'
    expect(user.save).to be false
    expect(user.errors.messages).to have_key(:password)
  end

  it 'should refuse password because too long' do
    user = build(:user)
    user.password = 'wrongwrongwrongwrongwrongwrongwrongwrongwrongwrong'
    expect(user.save).to be false
    expect(user.errors.messages).to have_key(:password)
  end
end
