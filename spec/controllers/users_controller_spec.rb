require 'rails_helper'

RSpec.describe Api::UsersController, type: :controller do
  describe 'POST #create' do
    context 'valid params' do
      before do
        post :create, params: {user: attributes_for(:user)}
      end

      it 'should create the user' do
        expect(response).to have_http_status(200)
        expect(User.count).to eq(1)
      end

      it 'should return the user' do
        json = JSON.parse(response.body)
        expect(json).to include('user')
      end

    end

    context 'already existing indexes' do
      before do
        user = build(:user)
        @user = user.clone
        user.save
      end

      it 'should refuse the user because email already exists' do
        @user.pseudo += '2'
        post :create, params: {user: @user.attributes}
        expect(response).to have_http_status(409)
        json = JSON.parse(response.body)
        expect(json['errors']).to include('email')
      end

      it 'should refuse the user because pseudo already exists' do

        @user.email = "2#{@user.email}"
        post :create, params: {user: @user.attributes}
        expect(response).to have_http_status(409)
        json = JSON.parse(response.body)
        expect(json['errors']).to include('pseudo')
      end
    end

    context 'wrong params' do
      it 'should return 422 because pseudo is missing' do
        user = build(:user)
        post :create, params: {
            user: {
                email: user.email,
                password: user.password,
                password_confirmation: user.password
            }
        }

        expect(response).to have_http_status(422)
      end

      it 'should return 422 because email is missing' do
        user = build(:user)
        post :create, params: {
            user: {
                pseudo: user.pseudo,
                password: user.password,
                password_confirmation: user.password
            }
        }

        expect(response).to have_http_status(422)
      end

      it 'should return 422 because password is missing' do
        user = build(:user)
        post :create, params: {
            user: {
                email: user.email,
                pseudo: user.pseudo,
            }
        }

        expect(response).to have_http_status(422)
      end

      it 'should return 422 because passwords don\'t match' do
        user = build(:user)
        post :create, params: {
            user: {
                email: user.email,
                pseudo: user.pseudo,
                password: user.password,
                password_confirmation: user.password + 'wrong'
            }
        }

        expect(response).to have_http_status(422)
      end
    end
  end
end
