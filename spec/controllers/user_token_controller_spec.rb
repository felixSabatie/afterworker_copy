require 'rails_helper'

RSpec.describe Api::UserTokenController, type: :controller do
  describe 'POST #create' do
    context 'valid params' do
      before do
        user = create(:user)
        post :create, params: {auth: {email: user.email, password: user.password}}
      end

      it 'should return 201 authorized success code' do
        expect(response).to have_http_status(201)
      end

      it 'should return the user token' do
        json = JSON.parse(response.body)
        expect(json).to include('jwt')
      end
    end

    context 'wrong credentials' do
      it 'should return 404 when wrong password' do
        user = create(:user)
        post :create, params: {auth: {email: user.email, password: user.password + 'wrong'}}
        expect(response).to have_http_status(404)
      end

      it 'should return 404 when wrong email' do
        user = create(:user)
        post :create, params: {auth: {email: "wrong.${user.email}", password: user.password}}
        expect(response).to have_http_status(404)
      end
    end

    context 'invalid params' do
      it 'should return an error' do
        expect{ post :create, params: {auth: {}} }.to raise_error(ActionController::ParameterMissing)
      end

      it 'should return an error because no email' do
        user = create(:user)
        post :create, params: {auth: {password: user.password}}
        expect(response).to have_http_status(404)
      end

      it 'should return an error because no password' do
        user = create(:user)
        post :create, params: {auth: {email: user.email}}
        expect(response).to have_http_status(404)
      end
    end
  end

end
